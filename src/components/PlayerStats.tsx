"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Star,
  Gamepad2,
  Sword,
  Shield,
  Flame,
  User,
  LogIn,
} from "lucide-react";
import Link from "next/link";

const PlayerStats = () => {
  const [animateProgress, setAnimateProgress] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  interface UserData {
    achievements?: number;
    favourites?: string[]; // Use string[] or define a custom type if needed
    gamesPlayed?: number;
    gamesWon?: number;
    streak?: number;
    bestStreak?: number;
    totalScore?: number;
    hoursPlayed?: number;
    favoriteGame?: string;
    rank?: string;
    rankProgress?: number;
  }

  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);

  // Check authentication status
  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setUserData(parsedUser);
          setIsLoggedIn(true);
        } catch {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  // Enhanced player data - now dynamic based on user
  const TOTAL_ACHIEVEMENTS = 20; // You can adjust this as needed
  const playerData = {
    achievements: userData?.achievements || 0,
    gamesWon: userData?.favourites?.length || 0,
    gamesPlayed: userData?.gamesPlayed || 0,
    winRate:
      (userData?.gamesPlayed ?? 0) > 0
        ? Math.round(((userData?.gamesWon || 0) / (userData?.gamesPlayed ?? 0)) * 100)
        : 0,
    streak: userData?.streak || 0,
    bestStreak: userData?.bestStreak || 0,
    totalScore: userData?.totalScore || 0,
    hoursPlayed: userData?.hoursPlayed || 0,
    favoriteGame: userData?.favoriteGame || "None",
    rank: userData?.rank || "Newbie",
    rankProgress: userData?.rankProgress || 0,
  };

  const achievementsProgress = Math.min(
    (playerData.achievements / TOTAL_ACHIEVEMENTS) * 100,
    100
  );

  // Animate progress on mount
  useEffect(() => {
    if (mounted && isLoggedIn) {
      const timer = setTimeout(() => setAnimateProgress(true), 500);
      return () => clearTimeout(timer);
    }
  }, [mounted, isLoggedIn]);

  // Don't render until mounted
  if (!mounted) {
    return null;
  }

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <div className="relative lg:ml-10 ml-0 max-w-xl w-full backdrop-blur-sm rounded-2xl p-8 overflow-hidden border border-primary shadow-2xl">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto bg-surface rounded-full flex items-center justify-center"
          >
            <User size={32} className="text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-bold text-primary">Player Stats</h3>
            <p className="text-secondary text-sm">
              Login to view your gaming statistics and progress
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/get-started">
              <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto">
                <LogIn size={18} />
                Get Started
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#bb3b3b]/15 via-red-500/10 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none blur-sm"
        />
        <motion.div
          animate={{
            scale: [1, 0.9, 1],
            opacity: [0.08, 0.12, 0.08],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-500/12 via-blue-500/8 to-transparent rounded-full translate-y-8 -translate-x-8 pointer-events-none blur-sm"
        />
      </div>
    );
  }

  const OverviewTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-3"
    >
      {/* Achievements Progress */}
      <div className="text-center">
        <div className="relative w-28 h-28 mx-auto mb-3">
          {/* Progress Ring */}
          <svg
            className="w-full h-full transform -rotate-90 relative z-10"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="3"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={251}
              initial={{ strokeDashoffset: 251 }}
              animate={{
                strokeDashoffset: animateProgress
                  ? 251 - (achievementsProgress / 100) * 251
                  : 251,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <div className="text-2xl font-bold text-primary mb-1">
                {playerData.achievements}/{TOTAL_ACHIEVEMENTS}
              </div>
              <div className="text-xs text-secondary">Achievements</div>
            </motion.div>
          </div>

          {/* Gaming-Related Orbiting Icons */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-10"
            style={{ transform: "scale(1.15)" }}
          >
            <motion.div
              animate={{
                y: [0, -3, 0, 2, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-1 left-1/2 -translate-x-1/2"
            >
              <Gamepad2
                size={11}
                className="text-blue-400 opacity-80 drop-shadow-md"
              />
            </motion.div>
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-10"
            style={{ transform: "scale(1.2)" }}
          >
            <motion.div
              animate={{
                x: [0, 3, 0, -2, 0],
                rotate: [0, 15, 0, -10, 0],
                scale: [1, 1.05, 1, 0.95, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-1 top-1/2 -translate-y-1/2"
            >
              <Sword
                size={10}
                className="text-red-400 opacity-75 drop-shadow-md"
              />
            </motion.div>
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-10"
            style={{ transform: "scale(1.18)" }}
          >
            <motion.div
              animate={{
                y: [0, 3, 0, -2, 0],
                scale: [1, 0.9, 1, 1.1, 1],
                rotate: [0, -8, 0, 8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2"
            >
              <Shield
                size={10}
                className="text-green-400 opacity-70 drop-shadow-md"
              />
            </motion.div>
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 z-10"
            style={{ transform: "scale(1.12)" }}
          >
            <motion.div
              animate={{
                x: [0, -3, 0, 2, 0],
                scale: [1, 1.15, 1, 0.85, 1],
                rotate: [0, 10, 0, -15, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-1 top-1/2 -translate-y-1/2"
            >
              <Flame
                size={9}
                className="text-orange-400 opacity-75 drop-shadow-md"
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="accent-bg text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 w-fit mx-auto">
          <Crown size={14} className="fill-yellow-400 stroke-yellow-400" />
          {playerData.rank}
          <div className="text-xs opacity-80">({playerData.rankProgress}%)</div>
        </div>
      </div>

      {/* Unique Stats (No Leveling) */}
      <div className="flex gap-2">
        <div className="flex-1 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl p-2 text-center">
          <Gamepad2 className="text-indigo-400 mx-auto mb-1" size={16} />
          <div className="text-primary text-sm font-bold truncate max-w-[80px] mx-auto">
            {playerData.favoriteGame}
          </div>
          <div className="text-secondary text-xs">Favorite Game</div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-2 text-center">
          <Flame className="text-orange-400 mx-auto mb-1" size={16} />
          <div className="text-primary text-sm font-bold">
            {playerData.hoursPlayed}
          </div>
          <div className="text-secondary text-xs">Hours Played</div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-2 text-center">
          <Shield className="text-green-400 mx-auto mb-1" size={16} />
          <div className="text-primary text-sm font-bold">
            {playerData.bestStreak}
          </div>
          <div className="text-secondary text-xs">Best Win Streak</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative lg:ml-10 ml-0 max-w-xl w-full backdrop-blur-sm rounded-2xl p-5 overflow-hidden border border-primary shadow-2xl">
      {/* Content */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          <OverviewTab key="overview" />
        </AnimatePresence>
      </div>

      {/* Achievements Progress Footer */}
      <div className="mt-4">
        <div className="bg-surface rounded-xl p-3 border border-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-yellow-400" />
            <span className="text-primary text-xs font-medium">
              Achievements Progress
            </span>
          </div>
          <span className="text-primary font-semibold text-xs">
            {playerData.achievements} / {TOTAL_ACHIEVEMENTS}
          </span>
        </div>
      </div>

      {/* Gradient Definitions */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bb3b3b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>

      {/* Enhanced Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#bb3b3b]/15 via-red-500/10 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none blur-sm"
      />
      <motion.div
        animate={{
          scale: [1, 0.9, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-500/12 via-blue-500/8 to-transparent rounded-full translate-y-8 -translate-x-8 pointer-events-none blur-sm"
      />

      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5 rounded-2xl pointer-events-none" />
    </div>
  );
};

export default PlayerStats;
