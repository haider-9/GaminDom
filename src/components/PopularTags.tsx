"use client";
import React, { useState, useEffect } from "react";
import { Hash, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto px-4 py-8"
      >
        <motion.div 
          className="h-8 bg-surface rounded-3xl w-64 mb-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="flex flex-wrap gap-3">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="h-10 bg-surface rounded-full w-24"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto px-4 py-8"
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          >
            <Hash className="text-blue-500" size={32} />
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Popular Tags
          </motion.h2>
        </div>
        <motion.button
          onClick={() => router.push("/tags")}
          className="text-blue-500 hover:text-blue-400 transition-colors text-lg font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          See All Tags
        </motion.button>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.button
              key={tag.id}
              onClick={() => router.push(`/tags/${tag.slug}`)}
              className={`group relative px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r text-sm ${getTagColor(
                index
              )}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
        

            {/* Content */}
            <motion.div 
              className="relative z-10 flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <Hash className="w-4 h-4" />
              </motion.div>
              <span>{tag.name}</span>
              <motion.span 
                className="text-xs bg-white/20 px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 + index * 0.05 }}
              >
                {(tag.games_count / 1000).toFixed(0)}k
              </motion.span>
            </motion.div>

            {/* Trending indicator for top 3 tags */}
            {index < 3 && (
              <motion.div 
                className="absolute -top-1 -right-1 bg-orange-500 text-white p-1 rounded-full"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <TrendingUp className="w-3 h-3" />
              </motion.div>
            )}
          </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 text-center">
        <p className="text-secondary">
          Discover games through thousands of community tags
        </p>
      </div>
    </motion.div>
  );
};

export default PopularTags;
