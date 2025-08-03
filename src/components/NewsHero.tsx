"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

const NewsHero = () => {
  const router = useRouter();
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Mock news data - in real app, this would come from an API
    const mockNews: NewsItem[] = [
      {
        id: "1",
        title: "Cyberpunk 2077: Phantom Liberty Expansion Breaks Sales Records",
        excerpt: "CD Projekt RED's latest expansion for Cyberpunk 2077 has exceeded all expectations, selling over 3 million copies in its first week.",
        image: "/assets/news/cyberpunk-news.jpg",
        author: "Alex Chen",
        date: "2024-01-15",
        category: "Industry News",
        readTime: "5 min read"
      },
      {
        id: "2", 
        title: "The Game Awards 2024: Complete Winners List and Highlights",
        excerpt: "Baldur's Gate 3 takes home Game of the Year while indie titles shine bright at this year's ceremony.",
        image: "/assets/news/game-awards.jpg",
        author: "Sarah Johnson",
        date: "2024-01-14",
        category: "Awards",
        readTime: "8 min read"
      },
      {
        id: "3",
        title: "PlayStation 5 Pro Officially Announced with 8K Gaming Support",
        excerpt: "Sony reveals the next iteration of their flagship console with enhanced ray tracing and AI upscaling capabilities.",
        image: "/assets/news/ps5-pro.jpg", 
        author: "Mike Rodriguez",
        date: "2024-01-13",
        category: "Hardware",
        readTime: "6 min read"
      }
    ];

    setFeaturedNews(mockNews);
  }, []);

  useEffect(() => {
    if (featuredNews.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredNews.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [featuredNews.length]);

  if (featuredNews.length === 0) {
    return (
      <div className="relative h-96 bg-black/50 rounded-3xl animate-pulse"></div>
    );
  }

  const currentNews = featuredNews[currentIndex];

  return (
    <div className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8">
        <div className="max-w-3xl">
          {/* Category Badge */}
          <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {currentNews.category}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {currentNews.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-white/90 mb-6 leading-relaxed">
            {currentNews.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-white/80 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{currentNews.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(currentNews.date).toLocaleDateString()}</span>
            </div>
            <span>{currentNews.readTime}</span>
          </div>

          {/* Read More Button */}
          <button
            onClick={() => router.push(`/news/${currentNews.id}`)}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors group"
          >
            Read Full Story
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {featuredNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default NewsHero;