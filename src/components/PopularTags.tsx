"use client";
import React, { useState, useEffect } from "react";
import { Hash, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface Tag {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

const PopularTags = () => {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

        const response = await fetch(
          `https://api.rawg.io/api/tags?key=${apiKey}&page_size=12&ordering=-games_count`
        );

        if (!response.ok) throw new Error("Failed to fetch tags");

        const data = await response.json();
        setTags(data.results);
      } catch (error) {
        console.error("Error fetching popular tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTags();
  }, []);

  const getTagColor = (index: number) => {
    const colors = [
      "from-red-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-violet-500",
      "from-orange-500 to-yellow-500",
      "from-indigo-500 to-blue-500",
      "from-pink-500 to-rose-500",
      "from-teal-500 to-green-500",
      "from-amber-500 to-orange-500",
      "from-lime-500 to-green-500",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-black/50 rounded-3xl w-64 animate-pulse mb-6"></div>
        <div className="flex flex-wrap gap-3">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-black/50 rounded-full w-24 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Hash className="text-blue-500" size={32} />
          <h2 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Popular Tags
          </h2>
        </div>
        <button
          onClick={() => router.push("/tags")}
          className="text-blue-500 hover:text-blue-400 transition-colors text-lg font-semibold"
        >
          See All Tags
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <button
            key={tag.id}
            onClick={() => router.push(`/tags/${tag.slug}`)}
            className={`group relative px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r text-sm ${getTagColor(
              index
            )}`}
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span>{tag.name}</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {(tag.games_count / 1000).toFixed(0)}k
              </span>
            </div>

            {/* Trending indicator for top 3 tags */}
            {index < 3 && (
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 text-center">
        <p className="text-white/70">
          Discover games through thousands of community tags
        </p>
      </div>
    </div>
  );
};

export default PopularTags;
