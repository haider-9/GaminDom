import React from "react";
import Header from "@/components/Header";
import NewsHero from "@/components/NewsHero";
import LatestNews from "@/components/LatestNews";
import TrendingNews from "@/components/TrendingNews";
import NewsCategories from "@/components/NewsCategories";

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <NewsHero />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LatestNews />
          </div>
          <div className="lg:col-span-1">
            <TrendingNews />
          </div>
        </div>
        
        <NewsCategories />
      </div>
      
      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 lg:h-0"></div>
    </div>
  );
};

export default NewsPage;