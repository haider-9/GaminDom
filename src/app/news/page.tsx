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
import { useDebounce } from "@/hooks/useDebounce";

interface NewsArticle {
  id: string;
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

interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: string;
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

  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Show typing indicator when search query is different from debounced query
  const isTyping = searchQuery !== debouncedSearchQuery && searchQuery.length > 0;

  const categories = [
    { id: "gaming", label: "Gaming", query: "general gaming news" },
    { id: "pc", label: "PC Gaming", query: "PC gaming news" },
    { id: "console", label: "Console", query: "console gaming news" },
    { id: "mobile", label: "Mobile Gaming", query: "mobile gaming news" },
    { id: "esports", label: "Esports", query: "esports news" },
    { id: "industry", label: "Industry", query: "gaming industry news" },
  ];

  const fetchNews = async (category: string, search: string = "", pageNum: number = 1) => {
    setLoading(true);
    try {
      const { newsApi } = await import("@/lib/api-client");

      let response: NewsResponse;

      if (search) {
        // If there's a search query, use it directly
        response = await newsApi.getGamingNews({
          q: search,
          page: pageNum,
          pageSize: 12,
          sortBy: 'publish_date'
        }) as NewsResponse;
      } else {
        // Otherwise, search by category
        response = await newsApi.searchNewsByCategory(category, pageNum, 12) as NewsResponse;
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
      showToast.error("Failed to fetch news articles from GameSpot. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Effect for initial load and category/page changes
  useEffect(() => {
    fetchNews(selectedCategory, debouncedSearchQuery, page);
  }, [selectedCategory, debouncedSearchQuery, page]);

  // Reset page when search query changes
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [debouncedSearchQuery, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search will be triggered automatically by the debounced effect
    // This is just for when user clicks the search button
    if (page !== 1) {
      setPage(1);
    } else {
      fetchNews(selectedCategory, searchQuery, 1);
    }
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
    <div className="min-h-screen bg-[var(--color-background)] p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#d1c0c0] hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>

          <div className="bg-[#1a0a0a] rounded-xl p-4 sm:p-6 border border-[#3a1a1a]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#bb3b3b] rounded-xl flex items-center justify-center flex-shrink-0">
                <Newspaper size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Gaming News</h1>
                <p className="text-sm sm:text-base text-[#d1c0c0]">
                  Stay updated with the latest gaming news and industry updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-[#1a0a0a] rounded-xl p-4 sm:p-6 border border-[#3a1a1a]">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4 sm:mb-6">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#8a6e6e]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gaming news..."
                  className="w-full bg-[#2a1a1a] border border-[#3a1a1a] rounded-lg pl-10 sm:pl-12 pr-16 sm:pr-20 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-[#8a6e6e] focus:border-[#bb3b3b] focus:outline-none transition-colors"
                />
                {isTyping && (
                  <div className="absolute right-12 sm:right-16 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-2 text-[#8a6e6e] text-sm">
                    <div className="w-3 h-3 border border-[#8a6e6e] border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-sm"
                >
                  <span className="hidden sm:inline">Search</span>
                  <Search size={16} className="sm:hidden" />
                </button>
              </div>
            </form>

            {/* Category Filters */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Filter size={14} className="text-[#8a6e6e] flex-shrink-0" />
              <span className="text-[#8a6e6e] text-xs sm:text-sm">Categories:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setPage(1);
                  }}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${selectedCategory === category.id
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-[#1a0a0a] rounded-xl border border-[#3a1a1a] overflow-hidden hover:border-[#bb3b3b] transition-all group flex flex-col"
              >
                {/* Article Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0">
                  <Image
                    src={article.urlToImage || "/placeholder-news.svg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-news.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <div className="flex items-center gap-2 text-xs text-white/80">
                      <Clock size={12} />
                      <span className="truncate">{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="text-[#bb3b3b] font-medium">
                      GameSpot
                    </span>
                    {article.author && (
                      <>
                        <span className="text-[#8a6e6e]">•</span>
                        <span className="text-[#8a6e6e] truncate">
                          {article.author}
                        </span>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/news/${article.id}`}
                    className="block flex-1"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-[#bb3b3b] transition-colors leading-tight">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-[#d1c0c0] text-sm mb-4 line-clamp-3 flex-1">
                    {article.description}
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 pt-2 border-t border-[#3a1a1a]">
                    <Link
                      href={`/news/${article.id}`}
                      className="inline-flex items-center gap-1.5 text-[#bb3b3b] hover:text-[#d14d4d] text-sm font-medium transition-colors"
                    >
                      Read More
                    </Link>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#8a6e6e] hover:text-[#d1c0c0] text-sm font-medium transition-colors"
                    >
                      <span className="hidden sm:inline">Original</span>
                      <span className="sm:hidden">Source</span>
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