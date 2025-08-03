"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingUp, Star, Calendar, Users, Play, Heart, Filter, ArrowLeft } from "lucide-react";
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
  ratings_count: number;
  added: number;
}

const TrendingGamesGrid = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("added");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&ordering=-${sortBy}&page_size=24&page=${page}&metacritic=70,100`
        );

        if (!response.ok) throw new Error("Failed to fetch trending games");

        const data = await response.json();
        if (page === 1) {
          setGames(data.results);
        } else {
          setGames(prev => [...prev, ...data.results]);
        }
      } catch (error) {
        console.error("Error fetching trending games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, [sortBy, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="h-12 bg-black/50 rounded-3xl w-64 animate-pulse"></div>
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
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TrendingUp className="text-orange-500" size={40} />
            <div>
              <h1 className="text-4xl font-bold text-white">Trending Games</h1>
              <p className="text-white/70 mt-2">Most popular games right now</p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-black/50 text-white px-4 py-2 rounded-full border border-white/20 focus:outline-none focus:border-white/40"
            >
              <option value="added">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="released">Recently Released</option>
              <option value="metacritic">Metacritic Score</option>
            </select>
            
            <button className="bg-black/50 text-white p-2 rounded-full border border-white/20 hover:bg-black/70 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game, index) => (
          <div
            key={game.id}
            onClick={() => router.push(`/game/${game.id}`)}
            className="relative group cursor-pointer rounded-3xl overflow-hidden bg-black/20 hover:scale-105 transition-all duration-300"
          >
            {/* Trending Badge */}
            <div className="absolute top-4 left-4 z-20 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              #{index + 1}
            </div>

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
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{(game.added / 1000).toFixed(0)}k</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
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
                
                {game.metacritic && (
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {game.metacritic}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button
          onClick={loadMore}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          {loading ? "Loading..." : "Load More Trending Games"}
        </button>
      </div>
    </div>
  );
};

export default TrendingGamesGrid;