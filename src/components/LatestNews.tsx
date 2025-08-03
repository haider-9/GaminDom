"use client";
import React, { useState, useEffect } from "react";
// import Image from "next/image"; // Unused import
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
}

const LatestNews = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock news data - in real app, this would come from an API
    const mockArticles: NewsArticle[] = [
      {
        id: "4",
        title: "Steam Deck 2 Rumors: What We Know So Far",
        excerpt: "Valve might be working on a successor to their popular handheld gaming device with improved performance and battery life.",
        image: "/assets/news/steam-deck.jpg",
        author: "Emma Wilson",
        date: "2024-01-12",
        category: "Hardware",
        readTime: "4 min read",
        tags: ["Steam", "Handheld", "Valve"]
      },
      {
        id: "5",
        title: "Indie Game Spotlight: Pizza Tower's Unexpected Success",
        excerpt: "How a small indie studio created one of 2023's most beloved platformers with unique art style and gameplay mechanics.",
        image: "/assets/news/pizza-tower.jpg",
        author: "David Kim",
        date: "2024-01-11",
        category: "Indie Games",
        readTime: "7 min read",
        tags: ["Indie", "Platformer", "Success Story"]
      },
      {
        id: "6",
        title: "Microsoft Acquires Another Major Gaming Studio",
        excerpt: "The tech giant continues its expansion in the gaming industry with the acquisition of a renowned RPG developer.",
        image: "/assets/news/microsoft-acquisition.jpg",
        author: "Lisa Chang",
        date: "2024-01-10",
        category: "Industry News",
        readTime: "5 min read",
        tags: ["Microsoft", "Acquisition", "RPG"]
      },
      {
        id: "7",
        title: "VR Gaming in 2024: The Year of Mainstream Adoption?",
        excerpt: "With new headsets and AAA titles, virtual reality gaming might finally reach the masses this year.",
        image: "/assets/news/vr-gaming.jpg",
        author: "Tom Anderson",
        date: "2024-01-09",
        category: "VR/AR",
        readTime: "6 min read",
        tags: ["VR", "Technology", "Future"]
      },
      {
        id: "8",
        title: "Esports World Championship 2024 Prize Pool Reaches $50M",
        excerpt: "The largest esports tournament in history promises record-breaking viewership and competition.",
        image: "/assets/news/esports-championship.jpg",
        author: "Rachel Green",
        date: "2024-01-08",
        category: "Esports",
        readTime: "3 min read",
        tags: ["Esports", "Tournament", "Prize Pool"]
      }
    ];

    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Hardware": "bg-blue-600",
      "Indie Games": "bg-green-600", 
      "Industry News": "bg-purple-600",
      "VR/AR": "bg-orange-600",
      "Esports": "bg-red-600"
    };
    return colors[category] || "bg-gray-600";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-black/50 rounded-3xl w-48 animate-pulse mb-6"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-black/50 rounded-3xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Latest News</h2>
      
      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            onClick={() => router.push(`/news/${article.id}`)}
            className="flex gap-4 p-4 bg-black/20 rounded-3xl hover:bg-black/30 transition-all duration-300 cursor-pointer group"
          >
            {/* Article Image */}
            <div className="relative w-32 h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800" />
            </div>

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              {/* Category Badge */}
              <div className={`inline-block ${getCategoryColor(article.category)} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
                {article.category}
              </div>

              {/* Title */}
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-white/70 text-sm mb-3 line-clamp-2">
                {article.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-white/60">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-white/10 text-white/70 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0 flex items-center">
              <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition-colors">
          Load More Articles
        </button>
      </div>
    </div>
  );
};

export default LatestNews;