"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      <div className="w-full max-w-3xl px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-black/50 rounded-3xl w-48 animate-pulse"></div>
          <div className="h-6 bg-black/50 rounded-3xl w-20 animate-pulse"></div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 h-48 bg-black/50 rounded-3xl animate-pulse"
            ></div>
          ))}
          <div className="flex-shrink-0 w-36 h-48 bg-black/50 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || games.length === 0) {
    return (
      <div className="w-full px-6 py-8">
        <div className="bg-black/50 rounded-3xl p-6 text-center">
          <p className="text-white/70">
            {error || "No new games available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl  px-2 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">New Games</h2>
        <Link 
          href={'/latest'}
          className="text-white/70 hover:text-white transition-colors text-lg"
        >
          See More
        </Link>
      </div>

      {/* Games Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all duration-200"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all duration-200"
        >
          <ChevronRight size={24} />
        </button>

        {/* Games Container - Fixed width to show 2 full + half of 3rd */}
        <div className="overflow-hidden w-full">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 240}px)`, // Slide by 240px (card width + gap)
            }}
          >
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className="flex-shrink-0 w-56 h-48 relative rounded-3xl overflow-hidden cursor-pointer group bg-black/20"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={game.background_image || "/placeholder-game.jpg"}
                    alt={game.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  {/* Top Icons */}
                  <div className="flex items-center justify-between">
                    <button className="bg-[#bb3b3b] hover:bg-[#bb3b3b]/80 text-white p-2 rounded-full transition-colors">
                      <Play size={14} fill="white" />
                    </button>
                    <div className="flex items-center gap-2">
                      {game.metacritic && (
                        <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                          {game.metacritic}
                        </div>
                      )}
                      <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-1.5 rounded-full transition-colors">
                        <Heart size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div>
                    <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">
                      {game.name}
                    </h3>
                    <p className="text-white/80 text-xs line-clamp-2 mb-2">
                      {game.genres.length > 0
                        ? `${game.genres[0].name} • ${new Date(
                            game.released
                          ).getFullYear()}`
                        : `Released ${new Date(game.released).getFullYear()}`}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < Math.round(game.rating)
                                ? "bg-yellow-400"
                                : "bg-white/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/70 text-xs">
                        {game.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default NewGames;
