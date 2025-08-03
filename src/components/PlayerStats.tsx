import React from "react";
import {
  Trophy,
  Target,
  Zap,
  Crown,
} from "lucide-react";

const PlayerStats = () => {
  // Mock player data
  const playerData = {
    level: 47,
    xp: 12450,
    maxXp: 15000,
    rank: "Diamond",
    gamesWon: 156,
    winRate: 73,
    streak: 12,
  };

  const xpProgress = (playerData.xp / playerData.maxXp) * 100;

  return (
    <div className="w-full max-w-sm">
      {/* Single Stats Card */}
      <div className="bg-black/50 rounded-3xl p-6 h-[280px] flex flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#bb3b3b] to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500 to-transparent rounded-full translate-y-12 -translate-x-12" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-xl font-bold">Player Stats</h2>
              <p className="text-white/70 text-sm">Level {playerData.level}</p>
            </div>
            <div className="bg-gradient-to-r from-[#bb3b3b] to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Crown size={12} />
              {playerData.rank}
            </div>
          </div>

          {/* Progress Blob */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Experience</span>
              <span className="text-white text-sm font-semibold">
                {playerData.xp.toLocaleString()} / {playerData.maxXp.toLocaleString()} XP
              </span>
            </div>
            
            {/* Modern Progress Blob */}
            <div className="relative h-6 bg-black/30 rounded-full overflow-hidden shadow-inner">
              {/* Main Progress Fill */}
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#bb3b3b] via-red-500 to-orange-400 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${xpProgress}%` }}
              />
              
              {/* Animated Glow Effect */}
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse"
                style={{ width: `${xpProgress}%` }}
              />
              
              {/* Shimmer Effect */}
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"
                style={{ 
                  width: `${xpProgress}%`,
                  animationDelay: '0.5s'
                }}
              />
              
              {/* Progress Indicator Dot */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-xl transition-all duration-1000 ease-out border-2 border-white/20"
                style={{ left: `calc(${xpProgress}% - 10px)` }}
              >
                <div className="absolute inset-1 bg-gradient-to-r from-[#bb3b3b] to-red-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full" />
              </div>
              
              {/* Inner Highlight */}
              <div 
                className="absolute top-1 left-1 right-1 h-1 bg-gradient-to-r from-white/30 via-white/10 to-transparent rounded-full"
                style={{ width: `calc(${xpProgress}% - 8px)` }}
              />
            </div>
            
            <p className="text-white/50 text-xs mt-2 text-center">
              {(playerData.maxXp - playerData.xp).toLocaleString()} XP to next level
            </p>
          </div>

          {/* 3 Icon Stats */}
          <div className="grid grid-cols-3 gap-4">
            {/* Games Won */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-4 mb-2 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-200 group-hover:scale-105">
                <Trophy className="text-blue-400 mx-auto mb-1" size={24} />
              </div>
              <p className="text-white font-bold text-lg">{playerData.gamesWon}</p>
              <p className="text-white/60 text-xs">Games Won</p>
            </div>

            {/* Win Rate */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-4 mb-2 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200 group-hover:scale-105">
                <Target className="text-green-400 mx-auto mb-1" size={24} />
              </div>
              <p className="text-white font-bold text-lg">{playerData.winRate}%</p>
              <p className="text-white/60 text-xs">Win Rate</p>
            </div>

            {/* Current Streak */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4 mb-2 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-200 group-hover:scale-105">
                <Zap className="text-yellow-400 mx-auto mb-1" size={24} />
              </div>
              <p className="text-white font-bold text-lg">{playerData.streak}</p>
              <p className="text-white/60 text-xs">Win Streak</p>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-8 right-8 w-2 h-2 bg-[#bb3b3b] rounded-full opacity-50 animate-pulse" />
        <div className="absolute bottom-12 left-8 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-16 left-12 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-40 animate-pulse" />
      </div>
    </div>
  );
};

export default PlayerStats;