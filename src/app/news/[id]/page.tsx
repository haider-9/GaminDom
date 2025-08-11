"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  ExternalLink,
  Share2,
  Tag,
  Eye,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { showToast } from "@/lib/toast-config";

interface NewsArticle {
  id: string;
  title: string;
  deck: string;
  lede: string;
  body: string;
  image: {
    original?: string;
    super_url?: string;
    screen_url?: string;
    medium_url?: string;
    small_url?: string;
    thumb_url?: string;
  };
  authors: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  associations: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  publish_date: string;
  update_date: string;
  site_detail_url: string;
  videos_api_url: string;
}

const NewsArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${articleId}`);

        if (!response.ok) {
          throw new Error('Article not found');
        }

        const data = await response.json();
        setArticle(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        showToast.error('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.deck,
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        showToast.success('Link copied to clipboard');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-[#2a1a1a] rounded-xl w-24 sm:w-32 mb-4 sm:mb-6"></div>
            <div className="h-48 sm:h-64 md:h-96 bg-[#2a1a1a] rounded-xl mb-6 sm:mb-8"></div>
            <div className="space-y-4 sm:space-y-6">
              <div className="h-8 sm:h-12 bg-[#2a1a1a] rounded-xl w-3/4"></div>
              <div className="space-y-2 sm:space-y-3">
                <div className="h-3 sm:h-4 bg-[#2a1a1a] rounded-xl"></div>
                <div className="h-3 sm:h-4 bg-[#2a1a1a] rounded-xl w-5/6"></div>
                <div className="h-3 sm:h-4 bg-[#2a1a1a] rounded-xl w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <div className="bg-[#1a0a0a] rounded-xl p-6 sm:p-8 text-center max-w-md w-full border border-[#3a1a1a]">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Article Not Found
          </h1>
          <p className="text-sm sm:text-base text-[#d1c0c0] mb-6">
            {error || 'The requested article could not be found.'}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-[#bb3b3b] hover:bg-[#d14d4d] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-colors text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="bg-[#1a0a0a] border-b border-[#3a1a1a] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#d1c0c0] hover:text-white transition-colors text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              Back
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 bg-[#2a1a1a] hover:bg-[#3a1a1a] rounded-full transition-colors"
              >
                <Share2 size={18} className="text-[#d1c0c0] sm:w-5 sm:h-5" />
              </button>
              <a
                href={article.site_detail_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 bg-[#2a1a1a] hover:bg-[#3a1a1a] rounded-full transition-colors"
              >
                <ExternalLink size={18} className="text-[#d1c0c0] sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          {/* Categories */}
          {article.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {article.categories.map((category) => (
                <span
                  key={category.id}
                  className="px-2.5 sm:px-3 py-1 bg-[#bb3b3b] text-white text-xs sm:text-sm rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight break-words">
            {article.title}
          </h1>

          {/* Deck/Summary */}
          {article.deck && (
            <p className="text-base sm:text-lg md:text-xl text-[#d1c0c0] mb-4 sm:mb-6 leading-relaxed">
              {article.deck}
            </p>
          )}

          {/* Article Meta */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-[#8a6e6e] mb-6 sm:mb-8 text-xs sm:text-sm">
            {article.authors.length > 0 && (
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <User size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {article.authors.map((author) => author.name).join(', ')}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Calendar size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{formatDate(article.publish_date)}</span>
            </div>
            {article.update_date !== article.publish_date && (
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <Clock size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Updated {formatDate(article.update_date)}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Article Image */}
        {article.image?.original && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden">
              <Image
                src={article.image.original}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-news.svg';
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          {/* Lede */}
          {article.lede && article.lede.trim() && (
            <div className="bg-[#1a0a0a] rounded-xl p-4 sm:p-6 border border-[#3a1a1a] mb-6 sm:mb-8">
              <p className="text-base sm:text-lg text-[#d1c0c0] leading-relaxed font-medium">
                {article.lede}
              </p>
            </div>
          )}

          {/* Article Body */}
          <div className="bg-[#1a0a0a] rounded-xl p-4 sm:p-6 lg:p-8 border border-[#3a1a1a] overflow-hidden">
            <div
              className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none break-words
                prose-headings:text-white prose-headings:font-bold prose-headings:mb-3 sm:prose-headings:mb-4 prose-headings:break-words
                prose-p:text-[#d1c0c0] prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4 lg:prose-p:mb-6 prose-p:break-words
                prose-a:text-[#bb3b3b] prose-a:no-underline hover:prose-a:text-[#d14d4d] prose-a:break-words
                prose-strong:text-white prose-em:text-[#d1c0c0]
                prose-ul:text-[#d1c0c0] prose-ol:text-[#d1c0c0] prose-ul:pl-4 sm:prose-ul:pl-6 prose-ol:pl-4 sm:prose-ol:pl-6
                prose-li:mb-1 sm:prose-li:mb-2 prose-li:leading-relaxed prose-li:break-words
                prose-blockquote:border-l-[#bb3b3b] prose-blockquote:bg-[#2a1a1a] prose-blockquote:p-2 sm:prose-blockquote:p-3 lg:prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:my-3 sm:prose-blockquote:my-4 prose-blockquote:break-words
                prose-code:bg-[#2a1a1a] prose-code:text-[#bb3b3b] prose-code:px-1 sm:prose-code:px-1.5 lg:prose-code:px-2 prose-code:py-0.5 sm:prose-code:py-1 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm prose-code:break-words
                prose-pre:bg-[#2a1a1a] prose-pre:border prose-pre:border-[#3a1a1a] prose-pre:rounded-lg prose-pre:p-3 sm:prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:text-xs sm:prose-pre:text-sm
                prose-img:rounded-lg prose-img:shadow-lg prose-img:w-full prose-img:h-auto prose-img:max-w-full prose-img:mx-auto prose-img:object-contain
                prose-figure:mx-0 prose-figure:my-4 sm:prose-figure:my-6 prose-figure:break-inside-avoid prose-figure:overflow-hidden
                prose-figcaption:text-center prose-figcaption:text-xs sm:prose-figcaption:text-sm prose-figcaption:text-[#8a6e6e] prose-figcaption:mt-2 prose-figcaption:break-words
                prose-table:w-full prose-table:overflow-x-auto prose-table:text-sm
                prose-th:bg-[#2a1a1a] prose-th:text-white prose-th:p-2 sm:prose-th:p-3 prose-th:border prose-th:border-[#3a1a1a]
                prose-td:text-[#d1c0c0] prose-td:p-2 sm:prose-td:p-3 prose-td:border prose-td:border-[#3a1a1a] prose-td:break-words
                [&_img]:max-w-full [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-lg [&_img]:mx-auto [&_img]:object-contain [&_img]:display-block
                [&_figure]:overflow-hidden [&_figure]:max-w-full [&_figure]:mx-auto
                [&_figure_img]:max-w-full [&_figure_img]:w-full [&_figure_img]:h-auto [&_figure_img]:object-contain
                [&_div_img]:max-w-full [&_div_img]:w-full [&_div_img]:h-auto [&_div_img]:object-contain
                [&_p_img]:max-w-full [&_p_img]:w-full [&_p_img]:h-auto [&_p_img]:object-contain
                [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:max-w-full
                [&_video]:w-full [&_video]:h-auto [&_video]:rounded-lg [&_video]:max-w-full
                [&_table]:overflow-x-auto [&_table]:block [&_table]:w-full [&_table]:whitespace-nowrap sm:[&_table]:whitespace-normal
                [&_div[data-embed-type='video']]:w-full [&_div[data-embed-type='video']]:aspect-video [&_div[data-embed-type='video']]:rounded-lg [&_div[data-embed-type='video']]:overflow-hidden
                [&_div[data-embed-type='toc']]:bg-[#2a1a1a] [&_div[data-embed-type='toc']]:border [&_div[data-embed-type='toc']]:border-[#3a1a1a] [&_div[data-embed-type='toc']]:rounded-lg [&_div[data-embed-type='toc']]:p-3 sm:[&_div[data-embed-type='toc']]:p-4 [&_div[data-embed-type='toc']]:my-4
                [&>*]:max-w-full [&>*]:overflow-hidden"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />
          </div>
        </motion.div>

        {/* Associations */}
        {article.associations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="bg-[#1a0a0a] rounded-xl p-4 sm:p-6 border border-[#3a1a1a]">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Gamepad2 size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-base sm:text-lg lg:text-xl">Related Games & Topics</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {article.associations.map((association) => (
                  <a
                    key={association.id}
                    href={association.site_detail_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#2a1a1a] hover:bg-[#3a1a1a] text-[#d1c0c0] hover:text-white rounded-lg text-xs sm:text-sm transition-colors border border-[#3a1a1a] hover:border-[#bb3b3b]"
                  >
                    <Tag size={10} className="sm:w-3 sm:h-3" />
                    <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{association.name}</span>
                    <ExternalLink size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center pt-6 sm:pt-8 border-t border-[#3a1a1a]"
        >
          <Link
            href="/news"
            className="flex items-center gap-2 text-[#d1c0c0] hover:text-white transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={16} />
            Back to News
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#2a1a1a] hover:bg-[#3a1a1a] text-[#d1c0c0] hover:text-white rounded-lg transition-colors text-sm"
            >
              <Share2 size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Share Article</span>
              <span className="sm:hidden">Share</span>
            </button>
            <a
              href={article.site_detail_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#bb3b3b] hover:bg-[#d14d4d] text-white rounded-lg transition-colors text-sm"
            >
              <Eye size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">View on GameSpot</span>
              <span className="sm:hidden">Source</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsArticlePage;