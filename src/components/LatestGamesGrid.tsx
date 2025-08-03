"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Star,
  Play,
  Heart,
  ArrowLeft,
  Clock,
  Sparkles,
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
  short_screenshots: Array<{ image: string }>;
  added: number;
}

const LatestGamesGrid = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 24;

  useEffect(() => {
    const fetchLatestGames = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&page_size=${itemsPerPage}&page=${currentPage}&dates=2024-01-01,2026-12-31&ordering=-released`
        );

        if (!response.ok) throw new Error("Failed to fetch games");

        const data = await response.json();
        setGames(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestGames();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getReleaseBadge = (releaseDate: string) => {
    const today = new Date();
    const release = new Date(releaseDate);
    const diffTime = release.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        text: "Coming Soon",
        color: "bg-blue-500",
        icon: <Clock size={12} />,
      };
    } else if (diffDays > -30) {
      return {
        text: "New",
        color: "bg-green-500",
        icon: <Sparkles size={12} />,
      };
    } else if (diffDays > -90) {
      return {
        text: "Recent",
        color: "bg-orange-500",
        icon: <Calendar size={12} />,
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 bg-black/50 rounded-3xl w-64 animate-pulse"></div>
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

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Calendar className="text-blue-500" size={40} />
            <div>
              <h1 className="text-4xl font-bold text-white">Latest Games</h1>
              <p className="text-white/70 mt-2">
                Newest releases and upcoming games (
                {totalCount.toLocaleString()} games)
              </p>
            </div>
          </div>

          {/* Filters */}
        </div>
      </div>

      {/* Release Status Cards */}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {games.map((game) => {
          const releaseBadge = getReleaseBadge(game.released);

          return (
            <div
              key={game.id}
              onClick={() => router.push(`/game/${game.id}`)}
              className="relative group cursor-pointer rounded-3xl overflow-hidden bg-black/20 hover:scale-105 transition-all duration-300"
            >
              {/* Release Status Badge */}
              {releaseBadge && (
                <div
                  className={`absolute top-4 left-4 z-20 ${releaseBadge.color} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1`}
                >
                  {releaseBadge.icon}
                  {releaseBadge.text}
                </div>
              )}

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
                    <span>{new Date(game.released).toLocaleDateString()}</span>
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

              {/* New release glow effect */}
              {releaseBadge?.text === "New" && (
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-green-500/5 to-transparent pointer-events-none" />
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

      {/* Latest Games Statistics */}
    </div>
  );
};

export default LatestGamesGrid;
