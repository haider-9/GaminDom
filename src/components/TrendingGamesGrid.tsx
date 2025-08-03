"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingUp, Star, Calendar, Users, Play, Heart, ArrowLeft,  Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import Pagination from "./Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 24;

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&ordering=-added&page_size=${itemsPerPage}&page=${currentPage}&metacritic=70,100`
        );

        if (!response.ok) throw new Error("Failed to fetch trending games");

        const data = await response.json();
        setGames(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching trending games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const getTrendingRank = (index: number) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  const getTrendingBadgeColor = (rank: number) => {
    if (rank <= 10) return "bg-gradient-to-r from-red-500 to-orange-500"; // Hot
    if (rank <= 50) return "bg-gradient-to-r from-orange-500 to-yellow-500"; // Trending
    return "bg-gradient-to-r from-yellow-500 to-green-500"; // Rising
  };

  if (loading) {
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
      <div className="mb-8 bg-black/50 rounded-3xl p-6">
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
              <p className="text-white/70 mt-2">
                Most popular games right now ({totalCount.toLocaleString()} games)
              </p>
            </div>
          </div>
          
          </div>
      </div>

      {/* Trending Stats */}
     

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {games.map((game, index) => {
          const trendingRank = getTrendingRank(index);
          const badgeColor = getTrendingBadgeColor(trendingRank);
          const isHot = trendingRank <= 10;
          
          return (
            <div
              key={game.id}
              onClick={() => router.push(`/game/${game.id}`)}
              className="relative group cursor-pointer rounded-3xl overflow-hidden bg-black/20 hover:scale-105 transition-all duration-300"
            >
              {/* Trending Badge */}
              <div className={`absolute top-4 left-4 z-20 ${badgeColor} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1`}>
                {isHot && <Flame size={12} />}
                #{trendingRank}
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

              {/* Hot game glow effect */}
              {isHot && (
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 via-orange-500/5 to-transparent pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Trending Statistics */}
    
    </div>
  );
};

export default TrendingGamesGrid;