import React from "react";
import LatestGamesGrid from "@/components/LatestGamesGrid";

const LatestPage = () => {
  return (
    <div className="min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LatestGamesGrid />
      </div>
      
      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default LatestPage;