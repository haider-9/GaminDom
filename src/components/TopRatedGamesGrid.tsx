"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Trophy,
  Star,
  Calendar,
  Users,

  ArrowLeft,

} from "lucide-react";
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

const TopRatedGamesGrid = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 24;

  useEffect(() => {
    const fetchTopRatedGames = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&ordering=-metacritic&page_size=${itemsPerPage}&page=${currentPage}&metacritic=85,100`
        );

        if (!response.ok) throw new Error("Failed to fetch top rated games");

        const data = await response.json();
        setGames(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching top rated games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedGames();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRankColor = (index: number) => {
    const globalRank = (currentPage - 1) * itemsPerPage + index;
    if (globalRank === 0) return "from-yellow-400 to-yellow-600"; // Gold
    if (globalRank === 1) return "from-gray-300 to-gray-500"; // Silver
    if (globalRank === 2) return "from-orange-400 to-orange-600"; // Bronze
    return "from-blue-400 to-blue-600"; // Default
  };

  const getGlobalRank = (index: number) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
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
            <div
              key={i}
              className="h-80 bg-black/50 rounded-3xl animate-pulse"
            ></div>
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
            <Trophy className="text-yellow-500" size={40} />
            <div>
              <h1 className="text-4xl font-bold text-white">Top Rated Games</h1>
              <p className="text-white/70 mt-2">
                Highest rated games of all time ({totalCount.toLocaleString()}{" "}
                games)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {games.map((game, index) => {
          const globalRank = getGlobalRank(index);
          const isTopThree = globalRank <= 3;

          return (
            <div
              key={game.id}
              onClick={() => router.push(`/game/${game.id}`)}
              className="relative group cursor-pointer rounded-3xl overflow-hidden bg-black/20  transition-all duration-300"
            >
              {/* Rank Badge */}
              <div
                className={`absolute top-4 left-4 z-20 bg-gradient-to-br ${getRankColor(
                  index
                )} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}
              >
                #{globalRank}
              </div>

              {/* Background Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={game.background_image || "/placeholder-game.svg"}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors">
                  <Star size={16} fill="white" />
                </button>
                <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors">
                  <Star size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold mb-2 line-clamp-1">
                  {game.name}
                </h3>

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
                    <span>{(game.ratings_count / 1000).toFixed(0)}k</span>
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

              {/* Special effects for top 3 globally */}
              {isTopThree && (
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
              )}

              {/* Crown for #1 */}
              {globalRank === 1 && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-400">
                  <Trophy size={20} fill="currentColor" />
                </div>
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
    </div>
  );
};

export default TopRatedGamesGrid;
