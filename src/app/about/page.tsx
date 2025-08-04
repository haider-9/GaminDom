import React from "react";
import { Github, ExternalLink, Heart, Code, Gamepad2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  const creators = [
    {
      name: "Haider Ahmad",
      github: "haider-9",
      website: "https://haiderahmad.vercel.app",
      avatar: "https://github.com/haider-9.png",
      role: "Full Stack Developer"
    },
    {
      name: "Sharoon",
      github: "sharoon166", 
      website: "https://sharoon.vercel.app",
      avatar: "https://github.com/sharoon166.png",
      role: "Frontend Developer"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-50"
              />
<div 
                className="relative bg-red-500/10 backdrop-blur-lg border border-white/20 p-6 rounded-full shadow-2xl"
             
              >
               <Image
               src={'/Logo.svg'}
               alt='Logo'
               width={75}
               height={75}
               />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
            About Gamindom
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A modern gaming platform built with passion, connecting gamers worldwide through 
            cutting-edge technology and immersive experiences.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                We&apos;re on a mission to revolutionize how gamers discover, explore, and connect with their favorite games. 
                Gamindom brings together the latest gaming news, comprehensive game databases, and a vibrant community 
                in one seamless platform.
              </p>
              <div className="flex items-center gap-4 text-red-400">
                <Heart className="fill-current" size={24} />
                <span className="text-lg font-medium">Built with love for the gaming community</span>
              </div>
            </div>
            
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-2xl blur-2xl opacity-20"
                style={{ background: "var(--color-red)" }}
              />
              <div 
                className="relative p-8 rounded-2xl border border-red-500/20"
                style={{ background: "rgba(187, 59, 59, 0.1)" }}
              >
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">500K+</div>
                    <div className="text-gray-400">Games Database</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-gray-400">Latest Updates</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">100%</div>
                    <div className="text-gray-400">Free Platform</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">∞</div>
                    <div className="text-gray-400">Gaming Passion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Built With Modern Tech</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border border-red-500/20 bg-red-500/5">
              <Code size={48} className="mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-bold text-white mb-2">Next.js 15</h3>
              <p className="text-gray-400">React framework with App Router for optimal performance</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TS</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">TypeScript</h3>
              <p className="text-gray-400">Type-safe development for better code quality</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">TW</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tailwind CSS</h3>
              <p className="text-gray-400">Utility-first CSS for rapid UI development</p>
            </div>
          </div>
        </div>

        {/* Creators Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Meet The Creators</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {creators.map((creator, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent hover:from-red-500/20 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="relative mb-6">
                    <div 
                      className="absolute inset-0 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"
                      style={{ background: "var(--color-red)" }}
                    />
                    <Image
                      src={creator.avatar}
                      alt={creator.name}
                      width={120}
                      height={120}
                      className="relative rounded-full mx-auto border-4 border-red-500/30 group-hover:border-red-500/60 transition-colors"
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{creator.name}</h3>
                  <p className="text-red-400 mb-6 font-medium">{creator.role}</p>
                  
                  <div className="flex justify-center gap-4">
                    <a
                      href={`https://github.com/${creator.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
                    >
                      <Github size={20} />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={creator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white"
                    >
                      <ExternalLink size={20} />
                      <span>Website</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div 
            className="inline-block p-8 rounded-2xl border border-red-500/30"
            style={{ background: "linear-gradient(135deg, rgba(187, 59, 59, 0.1), rgba(187, 59, 59, 0.05))" }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Game?</h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Join thousands of gamers discovering their next favorite game on Gamindom.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium"
            >
              <Gamepad2 size={20} />
              <span>Start Gaming</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default AboutPage;