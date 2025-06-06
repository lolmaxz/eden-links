/*
  # Final Blog Schema
  
  1. Tables
    - blog_posts: Simple posts without user ownership
    - post_likes: Track likes by IP address
  
  2. Security
    - Public read access to all posts and likes
    - Anyone can create likes (tracked by IP)
    - Only authenticated users can manage posts
  
  3. Functions
    - increment_likes: Safely increment post likes count
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS blog_posts;

-- Create blog_posts table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  likes integer DEFAULT 0
);

-- Create post_likes table
CREATE TABLE post_likes (
  post_id uuid REFERENCES blog_posts ON DELETE CASCADE,
  ip_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (post_id, ip_address)
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Anyone can read blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Post likes policies
CREATE POLICY "Anyone can read post likes"
  ON post_likes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create likes"
  ON post_likes FOR INSERT
  TO public
  WITH CHECK (true);

-- Create increment_likes function
CREATE OR REPLACE FUNCTION increment_likes(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE blog_posts
  SET likes = likes + 1
  WHERE id = post_id;
END;
$$;

-- Insert welcome post
INSERT INTO blog_posts (content) VALUES 
  ('Welcome to The Eden Apis! We just launched our new information website.');