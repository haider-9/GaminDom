"use client";
import React, { Suspense } from "react";
import RightSideBar from "@/components/RightSideBar";
import PNGCarousal from "@/components/PNGCarousal";
import RecentGame from "@/components/RecentGame";
import RecentGameSkeleton from "@/components/RecentGameSkeleton";
import NewGames from "@/components/NewGames";
import PlayerStats from "@/components/PlayerStats";
import TrendingGames from "@/components/TrendingGames";
import TopRatedGames from "@/components/TopRatedGames";
import PopularTags from "@/components/PopularTags";
import { motion } from "framer-motion";

const page = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-7xl mx-auto px-4 py-8"
    >
      <RightSideBar />

      {/* Grid Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8"
      >
        {/* Main Carousel - Takes full width on mobile, 8 cols on desktop */}
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PNGCarousal />
        </motion.div>

        {/* Recent Games - Takes full width on mobile, 4 cols on desktop */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Suspense fallback={<RecentGameSkeleton count={3} />}>
            <RecentGame />
          </Suspense>
        </motion.div>
      </motion.div>

      {/* Second Row Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <NewGames />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <PlayerStats />
        </motion.div>
      </motion.div>

      {/* Full Width Sections */}
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <TrendingGames />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <PopularTags />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <TopRatedGames />
        </motion.div>
      </motion.div>

      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </motion.div>
  );
};

export default page;
