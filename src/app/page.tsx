"use client";
import React, { Suspense } from "react";
import PNGCarousal from "@/components/PNGCarousal";
import RecentGame from "@/components/RecentGame";
import RecentGameSkeleton from "@/components/RecentGameSkeleton";
import NewGames from "@/components/NewGames";
import PlayerStats from "@/components/PlayerStats";
import TrendingGames from "@/components/TrendingGames";
import TopRatedGames from "@/components/TopRatedGames";
import PopularTags from "@/components/PopularTags";
import TrendingNews from "@/components/TrendingNews";
import { motion } from "framer-motion";
import MenuHintWithArrow from "@/components/MenuHintWithArrow";

const page = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-7xl mx-auto px-4 py-8 relative"
    >
      <MenuHintWithArrow />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Main Carousel - Takes full width on mobile, 8 cols on desktop */}
        <div className="lg:col-span-8">
          <PNGCarousal />
        </div>

        {/* Recent Games - Takes full width on mobile, 4 cols on desktop */}
        <div className="lg:col-span-4">
          <Suspense fallback={<RecentGameSkeleton count={3} />}>
            <RecentGame />
          </Suspense>
        </div>
      </div>

      {/* Trending News Section */}
      <div className="mb-8">
        <TrendingNews />
      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <NewGames />
        </div>
        <div>
          <PlayerStats />
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-8">
        <div>
          <TrendingGames />
        </div>
        <div>
          <PopularTags />
        </div>
        <div>
          <TopRatedGames />
        </div>
      </div>

      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </motion.div>
  );
};

export default page;
