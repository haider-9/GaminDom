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

const page = () => {
  return (
    <div className="space-y-8 w-4/5 mx-auto">
      <RightSideBar />

      {/* First Row - Desktop: side by side, Mobile: stacked */}
      <div className="flex flex-col lg:flex-row lg:items-center mx-auto lg:justify-between gap-6 lg:gap-0">
        <PNGCarousal />
        <Suspense fallback={<RecentGameSkeleton count={3} />}>
          <RecentGame />
        </Suspense>
      </div>

      {/* Second Row - Desktop: side by side, Mobile: stacked */}
      <div className="flex flex-col lg:flex-row lg:items-start mx-auto lg:justify-between gap-6 gap-y-4 lg:gap-0">
        <NewGames />
        <PlayerStats />
      </div>

      {/* Trending Games Section */}
      <TrendingGames />

      {/* Popular Tags Section */}
      <PopularTags />

      {/* Top Rated Games Section */}
      <TopRatedGames />

      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default page;
