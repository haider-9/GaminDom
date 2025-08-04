"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Zap,
  Crown,
  Star,
  Sparkles,
} from "lucide-react";

const PlayerStats = () => {
  const [animateProgress, setAnimateProgress] = useState(false);

  // Enhanced player data
  const playerData = {
    level: 47,
    xp: 12450,
    maxXp: 15000,
    rank: "Diamond",
    rankProgress: 85,
    gamesWon: 156,
    gamesPlayed: 214,
    winRate: 73,
    streak: 12,
    bestStreak: 18,
    totalScore: 2847650,
    achievements: 24,
    hoursPlayed: 127,
    favoriteGame: "Cyberpunk 2077",
  };

  const xpProgress = (playerData.xp / playerData.maxXp) * 100;

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 500);
    return () => clearTimeout(timer);
  }, []);

  
  const OverviewTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Level Progress */}
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* Outer Ring */}
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#outerGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={283}
              initial={{ strokeDashoffset: 283 }}
              animate={{
                strokeDashoffset: animateProgress
                  ? 283 - (playerData.rankProgress / 100) * 283
                  : 283,
              }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </svg>

          {/* Inner Ring */}
          <svg
            className="absolute inset-2 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#innerGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={251}
              initial={{ strokeDashoffset: 251 }}
              animate={{
                strokeDashoffset: animateProgress
                  ? 251 - (xpProgress / 100) * 251
                  : 251,
              }}
              transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white mb-1">
                {playerData.level}
              </div>
              <div className="text-xs text-white/60">Level</div>
            </motion.div>
          </div>

          {/* Floating Sparkles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Sparkles
              size={12}
              className="absolute top-2 right-6 text-yellow-400 opacity-60"
            />
            <Star
              size={8}
              className="absolute bottom-4 left-4 text-blue-400 opacity-40"
            />
            <Zap
              size={10}
              className="absolute top-8 left-2 text-purple-400 opacity-50"
            />
          </motion.div>
        </div>

        <div className="bg-gradient-to-r from-[#bb3b3b] to-red-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 w-fit mx-auto">
          <Crown size={14} className="fill-yellow-400 stroke-yellow-400" />
          {playerData.rank}
          <div className="text-xs opacity-80">({playerData.rankProgress}%)</div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4 text-center"
        >
          <Trophy className="text-blue-400 mx-auto mb-2" size={24} />
          <div className="text-white text-xl font-bold">
            {playerData.gamesWon}
          </div>
          <div className="text-white/60 text-xs">Games Won</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4 text-center"
        >
          <Target className="text-green-400 mx-auto mb-2" size={24} />
          <div className="text-white text-xl font-bold">
            {playerData.winRate}%
          </div>
          <div className="text-white/60 text-xs">Win Rate</div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-sm bg-black/50 rounded-3xl p-6">
      {/* Content */}
      <div className="p-6 min-h-[280px]">
        <AnimatePresence mode="wait">
        <OverviewTab key="overview" />
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 pb-4">
        <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-yellow-400" />
            <span className="text-white/80 text-sm">Favorite Game</span>
          </div>
          <span className="text-white font-medium text-sm">
            {playerData.favoriteGame}
          </span>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#bb3b3b]/10 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full translate-y-12 -translate-x-12 pointer-events-none" />
    </div>
  );
};

export default PlayerStats;
