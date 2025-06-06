import React from 'react';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { BlueskyIcon, WebsiteIcon, TikTokIcon, GumroadIcon, BoothIcon } from '../icons';

interface SocialLink {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function Header() {
  const socialLinks: SocialLink[] = [
    { icon: <WebsiteIcon className="w-4 h-4" />, label: 'Website', href: 'https://www.theedenapis.com' },
    { icon: <Twitter className="w-4 h-4" />, label: 'Twitter', href: 'https://x.com/TheEdenApis' },
    { icon: <Instagram className="w-4 h-4" />, label: 'Instagram', href: 'https://www.instagram.com/theedenapis/' },
    { icon: <Facebook className="w-4 h-4" />, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61563760756299' },
    { icon: <BlueskyIcon className="w-4 h-4" />, label: 'Bluesky', href: 'https://bsky.app/profile/theedenapis.com' },
    { icon: <TikTokIcon className="w-4 h-4" />, label: 'TikTok', href: 'https://www.tiktok.com/@theedenapis' },
    { icon: <GumroadIcon className="w-4 h-4" />, label: 'Gumroad', href: 'https://app.gumroad.com/theedenapis' },
    { icon: <BoothIcon className="w-4 h-4" />, label: 'Booth.pm', href: 'https://theedenapis.booth.pm/' },
  ];

  return (
    <div className="text-center mb-12">
      <img 
        src="/BRAND NEW EDEN LOGO DISCORD.png"
        alt="The Eden Apis"
        className="w-48 h-48 mx-auto mb-6 rounded-full border-4 border-purple-500 glow-purple"
      />
      <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        lolmaxz
      </h1>
      <p className="text-xl text-purple-300 mb-2">Creating the best and safest VRChat Community</p>
      <p className="text-sm text-purple-400">Founder of The Eden Apis</p>
      
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="p-2 rounded-full bg-purple-900/40 hover:bg-purple-800/60 transition-all duration-300 neon-border"
            title={link.label}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </div>
  );
}