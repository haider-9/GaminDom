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
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (xpProgress / 100) * circumference;

  return (
    <div className="w-full max-w-sm">
      {/* Single Stats Card */}
      <div className="bg-black/50 rounded-3xl p-6 h-[320px] flex flex-col justify-between relative overflow-hidden border border-gray-700/50">
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
              <Crown size={12} className="fill-yellow-400 stroke-yellow-400" />
              {playerData.rank}
            </div>
          </div>

          {/* Circular Progress Bar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              {/* Background Circle */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#2d3748"
                  strokeWidth="8"
                />
                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#bb3b3b" />
                    <stop offset="50%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {Math.round(xpProgress)}%
                </span>
                <span className="text-white/60 text-xs">
                  {playerData.xp.toLocaleString()}/{playerData.maxXp.toLocaleString()}
                </span>
              </div>
              
              {/* Animated Indicator */}
              <div 
                className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full shadow-lg transform -translate-x-1/2"
                style={{
                  transform: `rotate(${xpProgress * 3.6 - 90}deg) translate(${radius}px) rotate(${90 - xpProgress * 3.6}deg)`,
                  transition: "transform 0.5s ease-out"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent rounded-full" />
              </div>
            </div>
          </div>

          {/* Stats Icons */}
          <div className="grid grid-cols-3 gap-4">
            {/* Games Won */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500/15 to-cyan-500/15 border border-blue-500/40 rounded-xl p-3 mb-2 transition-all duration-200 group-hover:bg-blue-500/25">
                <Trophy 
                  className="text-blue-400 mx-auto" 
                  size={20} 
                  fill="currentColor"
                  fillOpacity="0.2"
                />
              </div>
              <p className="text-white font-bold text-lg">{playerData.gamesWon}</p>
              <p className="text-white/60 text-xs">Games Won</p>
            </div>

            {/* Win Rate */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 border border-green-500/40 rounded-xl p-3 mb-2 transition-all duration-200 group-hover:bg-green-500/25">
                <Target 
                  className="text-green-400 mx-auto" 
                  size={20}
                  fill="currentColor"
                  fillOpacity="0.2"
                />
              </div>
              <p className="text-white font-bold text-lg">{playerData.winRate}%</p>
              <p className="text-white/60 text-xs">Win Rate</p>
            </div>

            {/* Current Streak */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 border border-yellow-500/40 rounded-xl p-3 mb-2 transition-all duration-200 group-hover:bg-yellow-500/25">
                <Zap 
                  className="text-yellow-400 mx-auto" 
                  size={20}
                  fill="currentColor"
                  fillOpacity="0.2"
                />
              </div>
              <p className="text-white font-bold text-lg">{playerData.streak}</p>
              <p className="text-white/60 text-xs">Win Streak</p>
            </div>
          </div>
        </div>

        {/* Subtle Floating Particles */}
        <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-[#bb3b3b] rounded-full opacity-40" />
        <div className="absolute bottom-12 left-8 w-1 h-1 bg-blue-400 rounded-full opacity-30" />
        <div className="absolute top-16 left-12 w-1 h-1 bg-yellow-400 rounded-full opacity-30" />
      </div>
    </div>
  );
};

export default PlayerStats;