import React from 'react';

export function AboutMe() {
  return (
    <div className="grid-card mb-12">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <img
          src="/chibi_20210523_035617.png"
          alt="lolmaxz"
          className="w-32 h-32 rounded-full border-2 border-purple-500 glow-purple"
        />
        <div>
          <h2 className="text-2xl font-bold mb-2 text-purple-300">About Me</h2>
          <p className="text-gray-300 mb-2">
            Hey! I'm lolmaxz, a 31-year-old programmer passionate about VR and creating amazing experiences.
            When I'm not coding or exploring virtual worlds, I'm working on exciting projects for our community.
          </p>
          <p className="text-purple-400">
            Discord: lolmaxz
          </p>
        </div>
      </div>
    </div>
  );
}