"use client";
import React, { useState } from "react";
import Image from "next/image";
import { SiEpicgames, SiSteam } from "react-icons/si";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { GAMES_DATA, SAMPLE_AVATARS } from "@/constants";

const PNGCarousal = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === GAMES_DATA.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? GAMES_DATA.length - 1 : prev - 1));
  };

  const game = GAMES_DATA[currentIndex];

  return (
    <div className="relative w-full max-w-full lg:w-[780px]">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm hover:from-black/80 hover:to-black/60 text-white p-2 lg:p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <ChevronLeft size={20} className="lg:w-6 lg:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-sm hover:from-black/80 hover:to-black/60 text-white p-2 lg:p-3 rounded-full border border-white/20 transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <ChevronRight size={20} className="lg:w-6 lg:h-6" />
      </button>

      {/* Game Card */}
      <div className="relative h-[280px] lg:h-[350px] transition-all duration-500 ease-in-out">
        {/* Card */}
        <div
          className={`relative z-20 ${game.bgColor} rounded-3xl w-full h-full p-4 lg:p-8 pr-0 flex flex-col justify-between text-white overflow-hidden shadow-2xl`}
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-transparent rounded-3xl" />
          
          {/* Top Info */}
          <div className="flex items-center gap-2 lg:gap-4 relative z-10">
            {game.isPopular && (
              <span className="bg-gradient-to-r from-[#FDD161] to-[#FFE066] text-black text-xs lg:text-base px-2 lg:px-4 py-1 lg:py-2 rounded-full font-bold flex items-center gap-1 lg:gap-2 shadow-lg animate-pulse">
                <Flame size={12} className="lg:w-4 lg:h-4 animate-bounce" />
                Popular
              </span>
            )}
            <div className="flex items-center gap-2 lg:gap-3 text-lg lg:text-xl text-white">
              {game.platforms.includes("steam") && (
                <div className="bg-white/20 backdrop-blur-sm p-1.5 lg:p-2 rounded-lg lg:rounded-xl border border-white/30">
                  <SiSteam className="text-[#c7d5e0]" size={16} />
                </div>
              )}
              {game.platforms.includes("epic") && (
                <div className="bg-white/20 backdrop-blur-sm p-1.5 lg:p-2 rounded-lg lg:rounded-xl border border-white/30">
                  <SiEpicgames className="text-white" size={16} />
                </div>
              )}
            </div>
          </div>

          {/* Game Details */}
          <div className="max-w-[60%] lg:max-w-[55%] relative z-10">
            <h2 className="text-2xl lg:text-4xl font-bold mt-2 lg:mt-4 mb-2 lg:mb-3 leading-tight bg-gradient-to-r from-white to-white/90 bg-clip-text">
              {game.name}
            </h2>
            <p className="text-sm lg:text-base text-white/80 leading-relaxed line-clamp-3 lg:line-clamp-none">
              {game.description}
            </p>
          </div>

          {/* Reviews */}
          <div className="flex items-center gap-2 lg:gap-4 mt-2 lg:mt-4 relative z-10">
            <div className="flex -space-x-2 lg:-space-x-3">
              {SAMPLE_AVATARS.slice(0, 3).map((avatar, i) => (
                <Avatar key={i} className="w-6 h-6 lg:w-8 lg:h-8 border-2 lg:border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200">
                  <AvatarImage src={avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs font-semibold">
                    U{i + 1}
                  </AvatarFallback>
                </Avatar>
              ))}
              {/* Show 4th avatar only on desktop */}
              <Avatar className="hidden lg:flex w-8 h-8 border-3 border-white shadow-lg hover:scale-110 transition-transform duration-200">
                <AvatarImage src={SAMPLE_AVATARS[3]} />
                <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs font-semibold">
                  U4
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-sm lg:text-base bg-gradient-to-r from-white to-gray-100 text-black font-bold px-3 lg:px-5 py-1.5 lg:py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
              +{game.reviews} Reviews
            </div>
          </div>
        </div>

        {/* Character Image at bottom-right */}
        <div className="absolute bottom-0 -right-4 lg:-right-8 h-full w-[200px] lg:w-[300px] z-30 pointer-events-none select-none flex items-end">
          <div className="relative">
            {/* Character glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent blur-xl" />
            <Image
              src={game.image}
              alt={`${game.name} Character`}
              width={200}
              height={200}
              className="object-cover object center drop-shadow-2xl lg:w-[300px]"
              priority
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 lg:top-6 right-4 lg:right-6 w-2 lg:w-3 h-2 lg:h-3 bg-white/30 rounded-full animate-pulse" />
        <div className="absolute top-8 lg:top-12 right-8 lg:right-12 w-1.5 lg:w-2 h-1.5 lg:h-2 bg-white/20 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-16 lg:bottom-20 left-4 lg:left-8 w-1.5 lg:w-2 h-1.5 lg:h-2 bg-white/25 rounded-full animate-pulse delay-700" />
      </div>
    </div>
  );
};

export default PNGCarousal;