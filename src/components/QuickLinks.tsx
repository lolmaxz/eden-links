import React from 'react';
import { Code2, ExternalLink } from 'lucide-react';
import { DiscordIcon, RedditIcon, VRChatGroupIcon, PatreonIcon, VRChatWorldIcon } from '../icons';

export function QuickLinks() {
  const mainLinks = [
    { icon: <DiscordIcon className="w-6 h-6" />, text: 'Discord Server - Community', href: 'https://discord.gg/theedenapis' },
    { icon: <VRChatGroupIcon className="w-6 h-6 text-purple-400" />, text: 'VRChat Group', href: 'https://vrc.group/TEA.5003' },
    { icon: <VRChatWorldIcon className="w-6 h-6" />, text: 'VRChat World', href: 'https://vrchat.com/home/world/wrld_59284dd0-2ce5-4f52-9c07-2825feb44e65' },
    { icon: <RedditIcon className="w-6 h-6 text-purple-400" />, text: 'The Eden Apis Reddit', href: 'https://www.reddit.com/r/TheEdenApis/' },
    { icon: <Code2 className="w-6 h-6 text-purple-400" />, text: 'VRC-TS Library (VRChat API Wrapper in Typescript)', href: 'https://www.npmjs.com/package/vrc-ts' },
    { icon: <PatreonIcon className="w-6 h-6" />, text: 'Patreon', href: 'https://www.patreon.com/theedenapis' },
  ];

  return (
    <div className="grid-card">
      <h2 className="text-2xl font-bold mb-4 text-purple-300">Quick Links</h2>
      <div className="space-y-4">
        {mainLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="flex items-center gap-4 p-4 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 transition-all duration-300 neon-border"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
              {link.icon}
            </div>
            <span className="flex-1">{link.text}</span>
            <ExternalLink className="w-4 h-4 text-purple-400" />
          </a>
        ))}
      </div>
    </div>
  );
}