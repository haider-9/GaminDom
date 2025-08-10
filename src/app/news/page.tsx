"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Newspaper,
  ExternalLink,
  ArrowLeft,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { showToast } from "@/lib/toast-config";
import Pagination from "@/components/Pagination";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author?: string;
}

const NewsPage = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("gaming");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 12;

  const categories = [
    { id: "gaming", label: "Gaming", query: "gaming OR video games OR esports" },
    { id: "pc", label: "PC Gaming", query: "PC gaming OR Steam OR Epic Games" },
    { id: "console", label: "Console", query: "PlayStation OR Xbox OR Nintendo" },
    { id: "mobile", label: "Mobile Gaming", query: "mobile gaming OR iOS games OR Android games" },
    { id: "esports", label: "Esports", query: "esports OR competitive gaming OR tournaments" },
    { id: "industry", label: "Industry", query: "game industry OR game development OR gaming news" },
  ];

  const fetchNews = async (category: string, search: string = "", pageNum: number = 1) => {
    setLoading(true);
    try {
      const { newsApi } = await import("@/lib/api-client");

      let response;

      if (search) {
        // If there's a search query, use it directly
        response = await newsApi.getGamingNews({
          q: search,
          page: pageNum,
          pageSize: 12,
          sortBy: 'publishedAt'
        });
      } else {
        // Otherwise, search by category
        response = await newsApi.searchNewsByCategory(category, pageNum, 12);
      }

      if (response && response.articles) {
        setArticles(response.articles);
        setTotalResults(response.totalResults || response.articles.length);
        setTotalPages(Math.ceil((response.totalResults || response.articles.length) / itemsPerPage));
      } else {
        setArticles([]);
        setTotalResults(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      showToast.error("Failed to fetch news articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory, searchQuery, page);
  }, [selectedCategory, searchQuery, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchNews(selectedCategory, searchQuery, 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#d1c0c0] hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>

          <div className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#bb3b3b] rounded-xl flex items-center justify-center">
                <Newspaper size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Gaming News</h1>
                <p className="text-[#d1c0c0]">
                  Stay updated with the latest gaming news and industry updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-[#1a0a0a] rounded-xl p-6 border border-[#3a1a1a]">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8a6e6e]" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gaming news..."
                  className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Category Filters */}
            <div className="flex items-center gap-2 mb-4">
              <Filter size={16} className="text-[#8a6e6e]" />
              <span className="text-[#8a6e6e] text-sm">Categories:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                      ? "bg-[#bb3b3b] text-white"
                      : "bg-[#2a1a1a] text-[#d1c0c0] hover:text-white hover:bg-[#3a1a1a]"
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News Articles */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#bb3b3b]/30 border-t-[#bb3b3b] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-[#1a0a0a] rounded-xl border border-[#3a1a1a] overflow-hidden hover:border-[#bb3b3b] transition-all group"
              >
                {/* Article Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.urlToImage || "/placeholder-news.svg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-news.svg";
                    }}
                    unoptimized={!article.urlToImage?.includes('unsplash.com')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Clock size={12} />
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[#bb3b3b] font-medium">
                      {article.source.name}
                    </span>
                    {article.author && (
                      <>
                        <span className="text-[#8a6e6e]">•</span>
                        <span className="text-xs text-[#8a6e6e]">
                          {article.author}
                        </span>
                      </>
                    )}
                  </div>

                  <div

                    className="block"
                  >
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-[#bb3b3b] transition-colors">
                      {article.title}
                    </h3>
                  </div>

                  <p className="text-[#d1c0c0] text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>

                  <div className="flex items-center gap-4">

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#8a6e6e] hover:text-[#d1c0c0] text-sm font-medium transition-colors"
                    >
                      Original
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && articles.length > 0 && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={totalResults}
              itemsPerPage={itemsPerPage}
              itemType="articles"
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-12">
            <Newspaper size={64} className="text-[#bb3b3b] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
            <p className="text-[#d1c0c0] mb-6">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("gaming");
                setPage(1);
                fetchNews("gaming");
              }}
              className="bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-6 py-3 rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;