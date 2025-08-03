"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, Eye, MessageCircle, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TrendingArticle {
  id: string;
  title: string;
  views: number;
  comments: number;
  category: string;
  timeAgo: string;
  trending: boolean;
}

const TrendingNews = () => {
  const router = useRouter();
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock trending data
    const mockTrending: TrendingArticle[] = [
      {
        id: "t1",
        title: "GTA 6 Release Date Finally Confirmed by Rockstar",
        views: 125000,
        comments: 2340,
        category: "Breaking",
        timeAgo: "2 hours ago",
        trending: true
      },
      {
        id: "t2", 
        title: "Nintendo Direct Announces New Mario Game",
        views: 89000,
        comments: 1560,
        category: "Nintendo",
        timeAgo: "4 hours ago",
        trending: true
      },
      {
        id: "t3",
        title: "Elden Ring DLC Shadow of the Erdtree Review",
        views: 67000,
        comments: 890,
        category: "Reviews",
        timeAgo: "6 hours ago",
        trending: false
      },
      {
        id: "t4",
        title: "Steam Summer Sale 2024: Best Deals",
        views: 54000,
        comments: 720,
        category: "Deals",
        timeAgo: "8 hours ago",
        trending: false
      },
      {
        id: "t5",
        title: "Xbox Game Pass January 2024 Games Revealed",
        views: 43000,
        comments: 650,
        category: "Xbox",
        timeAgo: "12 hours ago",
        trending: false
      }
    ];

    setTimeout(() => {
      setTrendingArticles(mockTrending);
      setLoading(false);
    }, 800);
  }, []);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  if (loading) {
    return (
      <div className="bg-black/20 rounded-3xl p-6">
        <div className="h-8 bg-black/50 rounded-3xl w-48 animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-black/50 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="text-red-500" size={24} />
        <h2 className="text-2xl font-bold text-white">Trending</h2>
      </div>

      <div className="space-y-4">
        {trendingArticles.map((article, index) => (
          <div
            key={article.id}
            onClick={() => router.push(`/news/${article.id}`)}
            className="p-4 bg-black/20 rounded-2xl hover:bg-black/30 transition-all duration-300 cursor-pointer group"
          >
            {/* Rank and Trending Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/60 font-bold text-lg">#{index + 1}</span>
              {article.trending && (
                <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  HOT
                </div>
              )}
              <div className="bg-white/10 text-white/70 px-2 py-1 rounded-full text-xs">
                {article.category}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-sm mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
              {article.title}
            </h3>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViews(article.views)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{article.comments}</span>
                </div>
              </div>
              <span>{article.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Social Share Section */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h3 className="text-white font-semibold mb-3">Share Trending</h3>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-1">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingNews;