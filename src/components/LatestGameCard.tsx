"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Calendar,
  Trophy,
  Play,
  Heart,
  Flame,
  Clock,
} from "lucide-react";
import { SiSteam, SiEpicgames, SiPlaystation, SiBox } from "react-icons/si";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: Array<{ name: string }>;
  platforms: Array<{ platform: { name: string } }>;
  metacritic: number;
  playtime?: number;
}

interface LatestGameCardProps {
  game: Game;
  viewMode: "grid" | "list";
  onClick: () => void;
  showNewBadge?: boolean;
}

const LatestGameCard: React.FC<LatestGameCardProps> = ({
  game,
  viewMode,
  onClick,
  showNewBadge = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getPlatformIcon = (platformName: string) => {
    const name = platformName.toLowerCase();
    if (name.includes("steam"))
      return <SiSteam className="text-[#1b2838]" size={16} />;
    if (name.includes("epic"))
      return <SiEpicgames className="text-white" size={16} />;
    if (name.includes("playstation"))
      return <SiPlaystation className="text-[#003791]" size={16} />;
    if (name.includes("xbox"))
      return <SiBox className="text-[#107c10]" size={16} />;
    return null;
  };

  const isNewRelease = () => {
    const releaseDate = new Date(game.released);
    const now = new Date();
    const daysDiff =
      (now.getTime() - releaseDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 30;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "from-emerald-400 to-green-500";
    if (rating >= 4.0) return "from-blue-400 to-cyan-500";
    if (rating >= 3.5) return "from-yellow-400 to-orange-500";
    return "from-gray-400 to-gray-500";
  };

  const getMetacriticColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-green-400 to-emerald-500";
    if (score >= 80) return "bg-gradient-to-r from-yellow-400 to-orange-500";
    if (score >= 70) return "bg-gradient-to-r from-orange-400 to-red-500";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className="group relative cursor-pointer overflow-hidden"
      >
        {/* Modern Glass Card */}
        <div
          className={`relative bg-gradient-to-r from-black/40 via-black/30 to-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-500 ${
            !isMobile
              ? "hover:border-white/20 hover:shadow-2xl hover:shadow-[#bb3b3b]/20"
              : "shadow-lg shadow-black/20"
          }`}
        >
          {/* Animated Background Glow - Desktop only */}
          {!isMobile && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#bb3b3b]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          )}

          {/* Floating Particles Effect - Desktop only */}
          {!isMobile && (
            <>
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#bb3b3b] rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
              <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
            </>
          )}

          <div className="relative z-10 flex gap-6">
            {/* Modern Image Container */}
            <div className="relative w-32 h-32 flex-shrink-0">
              {!isMobile && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#bb3b3b]/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              <div
                className={`relative w-full h-full rounded-2xl overflow-hidden border border-white/10 transition-colors duration-300 ${
                  !isMobile ? "group-hover:border-white/20" : ""
                }`}
              >
                <Image
                  src={game.background_image || "/placeholder-game.jpg"}
                  alt={game.name}
                  width={128}
                  height={128}
                  className={`object-cover w-full h-full transition-all duration-700 ${
                    !isMobile && isHovered
                      ? "scale-110 brightness-110"
                      : "scale-100"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />

                {/* Modern NEW Badge */}
                {(showNewBadge || isNewRelease()) && (
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] text-black text-xs px-3 py-1.5 rounded-xl font-bold shadow-lg animate-pulse">
                    <div className="flex items-center gap-1">
                      <Flame size={12} className="animate-bounce" />
                      NEW
                    </div>
                  </div>
                )}

                {/* Image Loading Shimmer */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                )}
              </div>
            </div>

            {/* Enhanced Game Info */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Title and Score Row */}
              <div className="flex items-start justify-between">
                <h3
                  className={`text-white text-2xl font-bold truncate transition-all duration-300 ${
                    !isMobile
                      ? "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text"
                      : ""
                  }`}
                >
                  {game.name}
                </h3>
                {game.metacritic && (
                  <div
                    className={`px-3 py-1.5 rounded-xl text-white text-sm font-bold shadow-lg ${getMetacriticColor(
                      game.metacritic
                    )}`}
                  >
                    {game.metacritic}
                  </div>
                )}
              </div>

              {/* Modern Stats Row */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-r ${getRatingColor(
                      game.rating
                    )}`}
                  >
                    <Star size={14} className="text-white" fill="white" />
                  </div>
                  <span className="text-white font-semibold">
                    {game.rating.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500">
                    <Calendar size={14} className="text-white" />
                  </div>
                  <span className="text-white/80">
                    {new Date(game.released).getFullYear()}
                  </span>
                </div>

                {game.playtime && game.playtime > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500">
                      <Clock size={14} className="text-white" />
                    </div>
                    <span className="text-white/80">{game.playtime}h</span>
                  </div>
                )}
              </div>

              {/* Modern Platform Pills */}
              {game.platforms && game.platforms.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  {game.platforms.slice(0, 4).map((platform) => (
                    <div
                      key={platform.platform.name}
                      className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 transition-colors duration-200 ${
                        !isMobile ? "hover:bg-white/20" : ""
                      }`}
                    >
                      {getPlatformIcon(platform.platform.name)}
                    </div>
                  ))}
                </div>
              )}

              {/* Modern Genre Tags */}
              {game.genres && game.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {game.genres.slice(0, 3).map((genre, index) => (
                    <span
                      key={genre.name}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        !isMobile ? "hover:scale-105" : ""
                      } ${
                        index === 0
                          ? "bg-gradient-to-r from-[#bb3b3b]/20 to-red-500/20 text-red-300 border-red-500/30"
                          : `bg-white/10 text-white/80 border-white/20 ${
                              !isMobile ? "hover:bg-white/20" : ""
                            }`
                      }`}
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modern Action Buttons */}
            <div className="flex flex-col gap-3 items-center">
              <button
                className={`group/btn relative bg-gradient-to-r from-[#bb3b3b] to-red-600 text-white p-4 rounded-2xl transition-all duration-300 shadow-lg ${
                  !isMobile
                    ? "hover:from-red-500 hover:to-red-700 hover:scale-110 hover:shadow-red-500/25"
                    : "shadow-red-500/20"
                }`}
              >
                <Play
                  size={20}
                  fill="white"
                  className={
                    !isMobile
                      ? "group-hover/btn:scale-110 transition-transform duration-200"
                      : ""
                  }
                />
                {!isMobile && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                )}
              </button>

              <button
                className={`bg-white/10 backdrop-blur-sm border border-white/20 text-white p-3 rounded-2xl transition-all duration-300 ${
                  !isMobile ? "hover:bg-white/20 hover:scale-110" : ""
                }`}
              >
                <Heart
                  size={16}
                  className={
                    !isMobile
                      ? "hover:text-red-400 transition-colors duration-200"
                      : ""
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern Grid view with mobile-first design
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className="group relative cursor-pointer overflow-hidden"
    >
      {/* Modern Glass Card */}
      <div
        className={`relative bg-gradient-to-br from-black/40 via-black/30 to-black/20 backdrop-blur-xl border border-white/10 rounded-3xl transition-all duration-500 ${
          !isMobile
            ? "hover:border-white/20 hover:shadow-2xl hover:shadow-[#bb3b3b]/20 hover:-translate-y-2"
            : "shadow-xl shadow-black/20"
        }`}
      >
        {/* Animated Background Glow - Desktop only */}
        {!isMobile && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#bb3b3b]/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
        )}

        {/* Modern Image Container */}
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          {/* Image Glow Effect - Desktop only */}
          {!isMobile && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#bb3b3b]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          )}

          <Image
            src={game.background_image || "/placeholder-game.jpg"}
            alt={game.name}
            fill
            className={`object-cover transition-all duration-700 ${
              !isMobile && isHovered
                ? "scale-110 brightness-110 saturate-110"
                : "scale-100"
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Enhanced Gradient Overlay - Always visible on mobile */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${
              isMobile
                ? "from-black/80 via-black/40 to-transparent"
                : "from-black/90 via-black/30 to-transparent"
            }`}
          />

          {/* Modern NEW Badge */}
          {(showNewBadge || isNewRelease()) && (
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-gradient-to-r from-[#ff6b6b] to-[#ffd93d] text-black text-xs px-4 py-2 rounded-2xl font-bold shadow-xl animate-pulse">
                <div className="flex items-center gap-2">
                  <Flame size={14} className="animate-bounce" />
                  <span className="font-extrabold">NEW</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Metacritic Score */}
          {game.metacritic && (
            <div className="absolute top-4 right-4 z-20">
              <div
                className={`px-4 py-2 rounded-2xl text-white text-sm font-bold shadow-xl backdrop-blur-sm ${getMetacriticColor(
                  game.metacritic
                )}`}
              >
                <div className="flex items-center gap-1">
                  <Trophy size={12} />
                  {game.metacritic}
                </div>
              </div>
            </div>
          )}

          {/* Play Button - Always visible on mobile, hover on desktop */}
          <div
            className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-300 ${
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <button
              className={`group/btn relative bg-gradient-to-r from-[#bb3b3b] to-red-600 text-white rounded-full transition-all duration-300 shadow-2xl ${
                isMobile
                  ? "p-4 shadow-red-500/30"
                  : "p-6 hover:from-red-500 hover:to-red-700 hover:scale-125 hover:shadow-red-500/50 transform hover:rotate-12"
              }`}
            >
              <Play
                size={isMobile ? 20 : 24}
                fill="white"
                className={
                  !isMobile
                    ? "group-hover/btn:scale-110 transition-transform duration-200"
                    : ""
                }
              />
              {!isMobile && (
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
              )}
            </button>
          </div>

          {/* Heart Button - Always visible on mobile */}
          <div
            className={`absolute top-4 right-16 z-30 transition-all duration-300 ${
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <button
              className={`bg-white/20 backdrop-blur-xl border border-white/30 text-white p-3 rounded-full transition-all duration-300 ${
                !isMobile
                  ? "hover:bg-white/30 hover:scale-110 hover:text-red-400"
                  : ""
              }`}
            >
              <Heart size={16} className="transition-colors duration-200" />
            </button>
          </div>

          {/* Modern Platform Pills - Always visible on mobile */}
          {game.platforms && game.platforms.length > 0 && (
            <div
              className={`absolute bottom-4 left-4 flex gap-2 z-20 transition-all duration-300 ${
                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {game.platforms.slice(0, 3).map((platform) => (
                <div
                  key={platform.platform.name}
                  className={`bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-2 transition-colors duration-200 ${
                    !isMobile ? "hover:bg-white/30" : ""
                  }`}
                >
                  {getPlatformIcon(platform.platform.name)}
                </div>
              ))}
            </div>
          )}

          {/* Rating and Year overlay - Always visible on mobile */}
          <div
            className={`absolute bottom-4 right-4 flex gap-2 z-20 transition-all duration-300 ${
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
              <div
                className={`p-1 rounded-lg bg-gradient-to-r ${getRatingColor(
                  game.rating
                )}`}
              >
                <Star size={10} className="text-white" fill="white" />
              </div>
              <span className="text-white font-bold text-xs">
                {game.rating.toFixed(1)}
              </span>
            </div>
            <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
              <Calendar size={10} className="text-blue-400" />
              <span className="text-white font-bold text-xs">
                {new Date(game.released).getFullYear()}
              </span>
            </div>
          </div>

          {/* Image Loading Shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse z-10" />
          )}
        </div>

        {/* Enhanced Game Info Section */}
        <div className="p-6 space-y-4">
          {/* Title with Gradient Effect */}
          <h3
            className={`text-white text-xl font-bold line-clamp-2 leading-tight transition-all duration-300 ${
              !isMobile
                ? "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-gray-200 group-hover:to-white group-hover:bg-clip-text"
                : ""
            }`}
          >
            {game.name}
          </h3>

          {/* Modern Stats Grid - Simplified for mobile */}
          <div className="grid grid-cols-2 gap-3">
            {game.playtime && game.playtime > 0 && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 shadow-lg">
                  <Clock size={12} className="text-white" />
                </div>
                <div>
                  <span className="text-white font-bold text-sm">
                    {game.playtime}h
                  </span>
                  <p className="text-white/60 text-xs">Playtime</p>
                </div>
              </div>
            )}
          </div>

          {/* Modern Genre Tags */}
          {game.genres && game.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={genre.name}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold border transition-all duration-200 ${
                    !isMobile ? "hover:scale-105" : ""
                  } ${
                    index === 0
                      ? "bg-gradient-to-r from-[#bb3b3b]/30 to-red-500/30 text-red-200 border-red-400/50 shadow-lg shadow-red-500/20"
                      : `bg-white/10 text-white/80 border-white/20 backdrop-blur-sm ${
                          !isMobile ? "hover:bg-white/20" : ""
                        }`
                  }`}
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Floating Particles Effect - Desktop only */}
        {!isMobile && (
          <>
            <div className="absolute top-6 right-6 w-2 h-2 bg-[#bb3b3b] rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
            <div className="absolute top-12 right-12 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
            <div className="absolute bottom-20 left-6 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-700" />
          </>
        )}
      </div>
    </div>
  );
};

export default LatestGameCard;
