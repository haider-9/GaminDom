"use client";
import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // Unused for now
import {
  Gamepad2,
  Zap,
  Trophy,
} from "lucide-react";

const NotFound = () => {
  // const router = useRouter(); // Unused for now
  const [glitchText, setGlitchText] = useState("404");
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Glitch effect for 404 text
  useEffect(() => {
    const glitchChars = ["4", "0", "4", "█", "▓", "▒", "░"];
    const interval = setInterval(() => {
      const randomText = Array.from({ length: 3 }, () => 
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join("");
      setGlitchText(randomText);
      
      setTimeout(() => setGlitchText("404"), 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  // Unused handlers - can be implemented later if needed
  // const handleGoHome = () => router.push("/");
  // const handleGoBack = () => router.back();
  // const handleRefresh = () => window.location.reload();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#361518] via-[#2a1214] to-[#1a0c0e]">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-[#bb3b3b] rounded-full opacity-30 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#bb3b3b]/20 to-red-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Glitch 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-gradient-to-r from-[#bb3b3b] via-red-500 to-orange-400 bg-clip-text mb-4 select-none">
            {glitchText}
          </h1>
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">
              Game Not Found
            </h2>
            <div className="absolute inset-0 text-4xl md:text-6xl font-bold text-[#bb3b3b]/20 blur-sm">
              Game Not Found
            </div>
          </div>
        </div>

        {/* Gaming-themed Message */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="text-[#bb3b3b]" size={32} />
            <Zap className="text-yellow-400 animate-pulse" size={24} />
            <Trophy className="text-orange-400" size={28} />
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
            Oops! This level doesn&apos;t exist
          </p>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Looks like you&apos;ve wandered into uncharted territory. The page you&apos;re looking for might have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Gaming Stats Style Info */}
       

        {/* Gaming Tip */}
       
      </div>

      {/* Floating Action Button */}
      
      {/* Glitch Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#bb3b3b] to-transparent opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default NotFound;