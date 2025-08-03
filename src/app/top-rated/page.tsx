import React from "react";
import TopRatedGamesGrid from "@/components/TopRatedGamesGrid";

const TopRatedPage = () => {
  return (
    <div className="min-h-screen ">

      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TopRatedGamesGrid />
      </div>
      
      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default TopRatedPage;