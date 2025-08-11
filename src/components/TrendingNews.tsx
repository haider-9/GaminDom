"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Clock, ArrowRight, TrendingUp, Flame } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  author?: string;
}

const TrendingNews = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/news?limit=5&sort=publish_date:desc');

        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles?.slice(0, 4) || []);
        }
      } catch (error) {
        console.error('Error fetching trending news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a] relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#bb3b3b]/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#bb3b3b] to-[#d14d4d] rounded-xl flex items-center justify-center shadow-lg">
                <Newspaper size={22} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Flame size={12} className="text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">Trending News</h2>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#bb3b3b]/20 rounded-full">
                  <TrendingUp size={12} className="text-[#bb3b3b]" />
                  <span className="text-xs text-[#bb3b3b] font-medium">HOT</span>
                </div>
              </div>
              <p className="text-sm text-[#8a6e6e]">Latest gaming updates & breaking news</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#2a1a1a] rounded-xl overflow-hidden border border-[#3a1a1a]">
                <div className="w-full h-36 bg-[#3a1a1a]"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#3a1a1a] rounded w-3/4"></div>
                  <div className="h-3 bg-[#3a1a1a] rounded w-1/2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-[#3a1a1a] rounded-full w-16"></div>
                    <div className="h-3 bg-[#3a1a1a] rounded w-8"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a] relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#bb3b3b]/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#bb3b3b] to-[#d14d4d] rounded-xl flex items-center justify-center shadow-lg">
              <Newspaper size={22} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <Flame size={12} className="text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">Trending News</h2>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-[#bb3b3b]/20 rounded-full">
                <TrendingUp size={12} className="text-[#bb3b3b]" />
                <span className="text-xs text-[#bb3b3b] font-medium">HOT</span>
              </div>
            </div>
            <p className="text-sm text-[#8a6e6e]">Latest gaming updates & breaking news</p>
          </div>
        </div>

        <Link
          href="/news"
          className="flex items-center gap-2 px-3 py-2 bg-[#bb3b3b]/10 hover:bg-[#bb3b3b]/20 border border-[#bb3b3b]/30 rounded-lg text-[#bb3b3b] hover:text-[#d14d4d] transition-all text-sm font-medium"
        >
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* News Articles - Enhanced Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative"
          >
            <Link href={`/news/${article.id}`} className="block">
              <div className="bg-[#2a1a1a] rounded-xl overflow-hidden hover:bg-[#3a1a1a] transition-all duration-300 h-full border border-[#3a1a1a] hover:border-[#bb3b3b]/50 hover:shadow-lg hover:shadow-[#bb3b3b]/10">
                {/* Article Image */}
                <div className="relative w-full h-36 overflow-hidden">
                  <Image
                    src={article.urlToImage || '/placeholder-news.svg'}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-news.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Trending Badge */}
                  {index === 0 && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-orange-500 rounded-full">
                      <Flame size={10} className="text-white" />
                      <span className="text-xs text-white font-bold">TRENDING</span>
                    </div>
                  )}

                  {/* Time Badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-full">
                    <Clock size={10} className="text-white/80" />
                    <span className="text-xs text-white/80 font-medium">{formatDate(article.publishedAt)}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#bb3b3b] transition-colors mb-3 min-h-[2.5rem] leading-tight">
                    {article.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#8a6e6e]">
                      <span className="px-2 py-1 bg-[#bb3b3b]/10 rounded-full text-[#bb3b3b] font-medium">
                        GameSpot
                      </span>
                      {article.author && (
                        <span className="truncate max-w-20">{article.author}</span>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} className="text-[#bb3b3b]" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrendingNews;