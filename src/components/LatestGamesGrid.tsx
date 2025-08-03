"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Star, Play, Heart, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

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

const LatestGamesGrid = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("released");
  const [filterGenre, setFilterGenre] = useState("all");

  useEffect(() => {
    const fetchLatestGames = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&ordering=-${sortBy}&page_size=20&dates=2023-01-01,2026-12-31`
        );

        if (!response.ok) throw new Error("Failed to fetch games");

        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestGames();
  }, [sortBy]);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 bg-black/50 rounded-3xl w-64 animate-pulse"></div>
          <div className="h-10 bg-black/50 rounded-3xl w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-80 bg-black/50 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Latest Games</h1>
        
        {/* Filters */}
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/50 text-white px-4 py-2 rounded-full border border-white/20 focus:outline-none focus:border-white/40"
          >
            <option value="released">Release Date</option>
            <option value="rating">Rating</option>
            <option value="metacritic">Metacritic Score</option>
            <option value="added">Popularity</option>
          </select>
          
          <button className="bg-black/50 text-white p-2 rounded-full border border-white/20 hover:bg-black/70 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => router.push(`/game/${game.id}`)}
            className="relative group cursor-pointer rounded-3xl overflow-hidden bg-black/20 hover:scale-105 transition-all duration-300"
          >
            {/* Background Image */}
            <div className="relative h-64 overflow-hidden">
              <Image
                src={game.background_image || "/placeholder-game.jpg"}
                alt={game.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors">
                <Play size={16} fill="white" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors">
                <Heart size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-bold mb-2 line-clamp-1">{game.name}</h3>
              
              <div className="flex items-center gap-3 mb-2 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{game.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(game.released).getFullYear()}</span>
                </div>
                {game.metacritic && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {game.metacritic}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {game.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre.name}
                    className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold transition-colors">
          Load More Games
        </button>
      </div>
    </div>
  );
};

export default LatestGamesGrid;