import { randomUUID } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = process.env.DATA_DIR || path.join(root, "data");
const distDir = path.join(root, "dist");
const port = Number(process.env.PORT || 3000);
const serveStatic = process.env.SERVE_STATIC !== "0";

mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, "eden-links.sqlite"));
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    likes INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS post_likes (
    post_id TEXT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    PRIMARY KEY (post_id, ip_address)
  );
`);

const postCount = db.prepare("SELECT COUNT(*) AS n FROM blog_posts").get().n;
const seedPath = path.join(root, "seed", "blog.json");
if (postCount === 0 && existsSync(seedPath)) {
  const seed = JSON.parse(readFileSync(seedPath, "utf8"));
  db.exec("BEGIN");
  const insertPost = db.prepare(
    "INSERT INTO blog_posts (id, content, created_at, likes) VALUES (?, ?, ?, ?)"
  );
  const insertLike = db.prepare(
    "INSERT INTO post_likes (post_id, ip_address, created_at) VALUES (?, ?, ?)"
  );
  for (const post of seed.posts) {
    insertPost.run(post.id, post.content, post.created_at, post.likes);
  }
  for (const like of seed.likes) {
    insertLike.run(like.post_id, like.ip_address, like.created_at);
  }
  db.exec("COMMIT");
} else if (postCount === 0) {
  db.prepare("INSERT INTO blog_posts (id, content, likes) VALUES (?, ?, 0)").run(
    randomUUID(),
    "Welcome to The Eden Apis! We just launched our new information website."
  );
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function serveFile(res, urlPath) {
  const relative = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(distDir, relative));
  if (!filePath.startsWith(distDir)) {
    sendJson(res, 400, { error: "Bad path" });
    return;
  }
  const candidate = existsSync(filePath) && !filePath.endsWith(path.sep) ? filePath : path.join(distDir, "index.html");
  if (!existsSync(candidate)) {
    sendJson(res, 404, { error: "Not built" });
    return;
  }
  const type = mime[path.extname(candidate)] || "application/octet-stream";
  res.writeHead(200, { "content-type": type });
  createReadStream(candidate).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, { ok: true });
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/posts") {
      const posts = db
        .prepare("SELECT id, content, created_at, likes FROM blog_posts ORDER BY created_at DESC")
        .all();
      sendJson(res, 200, posts);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/likes") {
      const ip = url.searchParams.get("ip") || "";
      const likes = db.prepare("SELECT post_id FROM post_likes WHERE ip_address = ?").all(ip);
      sendJson(res, 200, likes);
      return;
    }
    const likeMatch = url.pathname.match(/^\/api\/posts\/([^/]+)\/like$/);
    if (req.method === "POST" && likeMatch) {
      const body = await readBody(req);
      const ip = String(body.ip || "");
      const postId = decodeURIComponent(likeMatch[1]);
      if (!ip) {
        sendJson(res, 400, { error: "IP address required" });
        return;
      }
      const existing = db
        .prepare("SELECT post_id FROM post_likes WHERE post_id = ? AND ip_address = ?")
        .get(postId, ip);
      if (existing) {
        sendJson(res, 409, { error: "Already liked" });
        return;
      }
      db.prepare("INSERT INTO post_likes (post_id, ip_address) VALUES (?, ?)").run(postId, ip);
      db.prepare("UPDATE blog_posts SET likes = likes + 1 WHERE id = ?").run(postId);
      sendJson(res, 200, { ok: true });
      return;
    }
    if (serveStatic) {
      await serveFile(res, url.pathname);
      return;
    }
    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Server error" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`eden-links listening on ${port}`);
});
