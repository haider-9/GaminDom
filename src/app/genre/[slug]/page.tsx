"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Grid3X3, List, Filter, SortAsc } from "lucide-react";
import LatestGameCard from "@/components/LatestGameCard";
import Pagination from "@/components/Pagination";

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

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

const GenrePage = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const gamesPerPage = 20;
  const params=useParams()
  const slug = params.slug as string.toLowerCase();

  useEffect(() => {
    fetchLatestGames(currentPage);
  }, [currentPage]);

  const fetchLatestGames = async (page: number) => {
    try {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

      // Calculate date range for latest games (last 6 months)

      const response = await fetch(
        `${apiUrl}?key=${apiKey}&page=${page}&page_size=${gamesPerPage}&genre=${slug}&ordering=-rating`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch latest games");
      }

      const data: ApiResponse = await response.json();
      setGames(data.results);
      setTotalGames(data.count);
      setTotalPages(Math.ceil(data.count / gamesPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGameClick = (gameId: number) => {
    router.push(`/game/${gameId}`);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="bg-black/50 rounded-3xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 bg-black/30 rounded-3xl w-32 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-black/30 rounded-2xl animate-pulse"></div>
                <div className="h-10 w-10 bg-black/30 rounded-2xl animate-pulse"></div>
              </div>
            </div>
            <div className="h-12 bg-black/30 rounded-3xl w-64 animate-pulse mb-2"></div>
            <div className="h-6 bg-black/30 rounded-3xl w-48 animate-pulse"></div>
          </div>

          {/* Games Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-black/50 rounded-3xl p-4 animate-pulse"
              >
                <div className="h-48 bg-black/30 rounded-2xl mb-4"></div>
                <div className="h-6 bg-black/30 rounded-2xl mb-2"></div>
                <div className="h-4 bg-black/30 rounded-2xl w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="bg-black/50 rounded-3xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">
            Error Loading Games
          </h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-[#bb3b3b] hover:bg-[#bb3b3b]/80 text-white px-6 py-3 rounded-3xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/50 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-2xl transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#bb3b3b] text-white"
                    : "bg-black/30 text-white/70"
                }`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-2xl transition-colors ${
                  viewMode === "list"
                    ? "bg-[#bb3b3b] text-white"
                    : "bg-black/30 text-white/70"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2 capitalize">{slug} Games</h1>
         
        </div>

        {/* Games Grid/List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="bg-black/50 rounded-3xl p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              } mb-8`}
            >
              {games.map((game) => (
                <LatestGameCard
                  key={game.id}
                  game={game}
                  viewMode={viewMode}
                  onClick={() => handleGameClick(game.id)}
                  showNewBadge={false}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalGames}
              itemsPerPage={gamesPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
