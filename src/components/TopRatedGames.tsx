"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: Array<{ name: string }>;
  metacritic: number;
  ratings_count: number;
}

const TopRatedGames = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedGames = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&ordering=-metacritic&page_size=5&metacritic=85,100`
        );

        if (!response.ok) throw new Error("Failed to fetch top rated games");

        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error("Error fetching top rated games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedGames();
  }, []);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mx-auto px-4 py-8"
      >
        <motion.div 
          className="h-8 bg-surface rounded-3xl w-64 mb-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="h-24 bg-surface rounded-3xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
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
      className="w-full mx-auto px-4 py-8"
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
            <Trophy className="text-yellow-500" size={32} />
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold text-primary"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Top Rated
          </motion.h2>
        </div>
        <motion.button
          onClick={() => router.push("/top-rated")}
          className="text-yellow-500 hover:text-yellow-400 transition-colors text-lg font-semibold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          See More
        </motion.button>
      </motion.div>

      <div className="space-y-4">
        <AnimatePresence>
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              onClick={() => router.push(`/game/${game.id}`)}
              className="flex items-center gap-4 p-4 bg-surface hover:bg-surface-hover rounded-3xl cursor-pointer group"
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300
              }}
              whileHover={{ 
                scale: 1.02, 
                x: 5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
            {/* Rank */}
            <motion.div 
              className="flex-shrink-0 sm:w-12 sm:h-12 size-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="text-black font-bold">#{index + 1}</span>
            </motion.div>

            {/* Game Image */}
            <motion.div 
              className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={game.background_image || "/placeholder-game.jpg"}
                alt={game.name}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Game Info */}
            <motion.div 
              className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              <motion.h3 
                className="text-primary font-bold text-lg line-clamp-1 mb-1"
                whileHover={{ scale: 1.02 }}
              >
                {game.name}
              </motion.h3>
              <motion.div 
                className="flex items-center gap-4 text-sm text-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              >
                <div className="flex items-center gap-1">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <Star className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                  <span>{game.rating.toFixed(1)}</span>
                </div>
                <span>{new Date(game.released).getFullYear()}</span>
                <span>{game.genres[0]?.name}</span>
              </motion.div>
            </motion.div>

            {/* Metacritic Score */}
            <motion.div 
              className="flex-shrink-0 md:block hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="bg-green-500 text-white px-3 py-2 rounded-full font-bold">
                {game.metacritic}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TopRatedGames;
