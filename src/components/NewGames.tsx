"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
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
  short_screenshots: Array<{ image: string }>;
}

const NewGames = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNewGames = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        // Fetch 10 newest games with high ratings
        const response = await fetch(
          `${apiUrl}?key=${apiKey}&ordering=-released&metacritic=75,100&dates=2023-01-01,2026-12-31`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch games data");
        }

        const data = await response.json();
        setGames(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNewGames();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= games.length - 3 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? Math.max(0, games.length - 3) : prev - 1
    );
  };

  const handleGameClick = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-6 py-8"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.div
            className="h-8 bg-surface rounded-3xl w-48"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="h-6 bg-surface rounded-3xl w-20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="flex-shrink-0 w-72 h-48 bg-surface rounded-3xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          <motion.div
            className="flex-shrink-0 w-36 h-48 bg-surface rounded-3xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </motion.div>
    );
  }

  if (error || games.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full px-6 py-8"
      >
        <motion.div
          className="bg-surface rounded-3xl p-6 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <p className="text-secondary">
            {error || "No new games available at the moment."}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="px-2 py-8 w-full max-w-full lg:w-[780px]"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between mb-6"
      >
        <motion.h2
          className="text-3xl font-bold text-primary"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          New Games
        </motion.h2>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={'/latest'}
            className="text-secondary hover:text-primary transition-colors text-lg"
          >
            See More
          </Link>
        </motion.div>
      </motion.div>

      {/* Games Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative"
      >
        {/* Navigation Buttons */}
        <motion.button
          onClick={prevSlide}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-surface hover:bg-surface-hover text-primary p-3 rounded-full shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <ChevronLeft size={20} />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-surface hover:bg-surface-hover text-primary p-3 rounded-full shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <ChevronRight size={20} />
        </motion.button>

        {/* Games Container - Fixed width to show 2 full + half of 3rd */}
        <div className="overflow-hidden w-full">
          <motion.div
            className="flex gap-4"
            animate={{ x: -currentIndex * 240 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.6
            }}
          >
            <AnimatePresence mode="wait">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  onClick={() => handleGameClick(game.id)}
                  className="flex-shrink-0 w-56 md:w-56 h-48 md:h-64 relative rounded-3xl overflow-hidden cursor-pointer group bg-surface"
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background Image */}
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={game.background_image || "/placeholder-game.jpg"}
                      alt={game.name}
                      fill
                      className="object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"
                      whileHover={{ opacity: 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className="relative z-10 p-4 h-full flex flex-col justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {/* Top Icons */}
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <motion.button
                        className="accent-bg hover:accent-bg-hover text-white p-2 rounded-full transition-colors"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play size={14} fill="white" />
                      </motion.button>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        {game.metacritic && (
                          <motion.div
                            className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
                            whileHover={{ scale: 1.05 }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
                          >
                            {game.metacritic}
                          </motion.div>
                        )}
                        <motion.button
                          className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-1.5 rounded-full transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart size={12} />
                        </motion.button>
                      </motion.div>
                    </motion.div>

                    {/* Game Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <motion.h3
                        className="text-white text-lg font-bold mb-1 line-clamp-1"
                        whileHover={{ scale: 1.02 }}
                      >
                        {game.name}
                      </motion.h3>
                      <motion.p
                        className="text-white/80 text-xs line-clamp-2 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        {game.genres.length > 0
                          ? `${game.genres[0].name} • ${new Date(
                            game.released
                          ).getFullYear()}`
                          : `Released ${new Date(game.released).getFullYear()}`}
                      </motion.p>

                      {/* Rating */}
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${i < Math.round(game.rating)
                                ? "bg-yellow-400"
                                : "bg-white/30"
                                }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                delay: 0.7 + i * 0.05
                              }}
                            />
                          ))}
                        </div>
                        <motion.span
                          className="text-white/70 text-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.8 }}
                        >
                          {game.rating.toFixed(1)}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black/20"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>


      </motion.div>
    </motion.div>
  );
};

export default NewGames;
