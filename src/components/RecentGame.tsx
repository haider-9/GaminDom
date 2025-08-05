"use client";
import { ChevronRight, Star, Calendar, Gamepad2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: Array<{ name: string }>;
  platforms: Array<{ platform: { name: string } }>;
  metacritic: number;
}

const RecentGame = () => {
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&page_size=3&ordering=-added&metacritic=80,100`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch games data");
        }

        const data = await response.json();
        setGamesList(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="flex items-center bg-surface p-3 rounded-3xl w-full justify-between gap-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          >
            <div className="rounded-lg size-16 bg-surface"></div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="h-4 bg-surface rounded w-3/4"></div>
              <div className="h-3 bg-surface rounded w-1/2"></div>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface rounded-3xl p-4 text-center"
      >
        <p className="text-secondary text-sm">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-3"
    >
      <AnimatePresence>
        {gamesList.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 300
            }}
            whileHover={{
              scale: 1.02,
              x: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={`/game/${game.id}`}
              className="flex items-center bg-surface p-3 rounded-3xl w-full justify-between gap-4 hover:bg-surface-hover transition-all duration-200 cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-lg size-16 overflow-hidden">
                  <Image
                    src={
                      game.background_image ||
                      "https://dummyimage.com/64x64/666/fff?text=Game"
                    }
                    alt={game.name}
                    width={64}
                    height={64}
                    className="object-cover object-center w-full h-full"
                  />
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col gap-1 flex-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              >
                <motion.h1
                  className="text-primary text-lg font-bold truncate"
                  whileHover={{ scale: 1.02 }}
                >
                  {game.name}
                </motion.h1>
                <p className="text-secondary text-sm line-clamp-2">
                  {game.platforms && game.platforms.length > 0
                    ? `Available on ${game.platforms
                      .slice(0, 2)
                      .map((p) => p.platform.name)
                      .join(", ")}`
                    : "Multi-platform game"}
                </p>

                {/* Game Info */}
                <motion.div
                  className="flex items-center gap-3 mt-1 flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  <div className="flex items-center gap-1">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    </motion.div>
                    <span className="text-yellow-400 text-xs font-semibold">
                      {game.rating ? game.rating.toFixed(1) : "N/A"}
                    </span>
                  </div>

                  {game.released && (
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-blue-400" />
                      <span className="text-blue-400 text-xs">
                        {new Date(game.released).getFullYear()}
                      </span>
                    </div>
                  )}

                  {game.metacritic && (
                    <div className="flex items-center gap-1">
                      <Gamepad2 size={12} className="text-green-400" />
                      <span className="text-green-400 text-xs font-semibold">
                        {game.metacritic}
                      </span>
                    </div>
                  )}

                  {game.genres && game.genres.length > 0 && (
                    <motion.span
                      className="text-purple-400 text-xs bg-purple-500/20 px-2 py-0.5 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.4 + index * 0.05 }}
                    >
                      {game.genres[0].name}
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, x: 2 }}
              >
                <ChevronRight size={20} className="text-muted" />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecentGame;