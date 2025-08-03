"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Grid3X3,
  List,

  Search,
  X,
} from "lucide-react";
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

const SearchPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchQuery = decodeURIComponent(params.query as string);

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchInput, setSearchInput] = useState(searchQuery);
  const gamesPerPage = 20;

  useEffect(() => {
    if (searchQuery) {
      setSearchInput(searchQuery);
      fetchSearchResults(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage]);

  const fetchSearchResults = async (query: string, page: number) => {
    try {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
      const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

      const response = await fetch(
        `${apiUrl}?key=${apiKey}&page=${page}&page_size=${gamesPerPage}&search=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
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

  const handleNewSearch = () => {
    if (searchInput.trim() && searchInput.trim() !== searchQuery) {
      router.push(`/search/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleNewSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
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
          <h1 className="text-2xl font-bold text-white mb-4">Search Error</h1>
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

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              placeholder="Search for games..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-12 py-3 bg-black/30 text-white placeholder-white/50 rounded-3xl border border-white/10 focus:outline-none focus:border-[#bb3b3b] transition-colors"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">
            Search Results for &quot;{searchQuery}&quot;
          </h1>
          <p className="text-white/70">
            {loading
              ? "Searching..."
              : `Found ${totalGames.toLocaleString()} games`}
          </p>
        </div>

        {/* No Results */}
        {!loading && games.length === 0 ? (
          <div className="bg-black/50 rounded-3xl p-12 text-center">
            <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              No Games Found
            </h2>
            <p className="text-white/70 mb-6">
              We couldn&apos;t find any games matching &quot;{searchQuery}&quot;. Try searching
              with different keywords.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/latest")}
                className="bg-[#bb3b3b] hover:bg-[#bb3b3b]/80 text-white px-6 py-3 rounded-3xl transition-colors"
              >
                Browse Latest Games
              </button>
              <button
                onClick={() => setSearchInput("")}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-3xl transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
