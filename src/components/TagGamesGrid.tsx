"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Hash,
  Star,
  Calendar,
  Users,
  Play,
  Heart,
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
  tags: Array<{ name: string }>;
  added: number;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
  description: string;
}

interface TagGamesGridProps {
  tagSlug: string;
}

const TagGamesGrid = ({ tagSlug }: TagGamesGridProps) => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 24;

  useEffect(() => {
    const fetchTagAndGames = async () => {
      try {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;

        // Fetch tag details
        const tagResponse = await fetch(
          `https://api.rawg.io/api/tags/${tagSlug}?key=${apiKey}`
        );

        if (tagResponse.ok) {
          const tagData = await tagResponse.json();
          setTag(tagData);
        }

        // Fetch games for this tag
        const gamesResponse = await fetch(
          `https://api.rawg.io/api/games?key=${apiKey}&tags=${tagSlug}&page_size=${itemsPerPage}&page=${currentPage}&ordering=-rating`
        );

        if (!gamesResponse.ok) throw new Error("Failed to fetch games");

        const gamesData = await gamesResponse.json();
        setGames(gamesData.results);
        setTotalCount(gamesData.count);
        setTotalPages(Math.ceil(gamesData.count / itemsPerPage));
      } catch (error) {
        console.error("Error fetching tag games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTagAndGames();
  }, [tagSlug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div>
        <div className="h-32 bg-black/50 rounded-3xl animate-pulse mb-8"></div>
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
      {/* Tag Header */}
      <div className="relative mb-8 p-8 rounded-3xl overflow-hidden">
        <div className={`absolute inset-0 bg-black/50`} />

        <div className="relative z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tags
          </button>

          <div className="flex items-center gap-4 mb-4">
            <Hash className="text-white" size={40} />
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                {tag?.name ||
                  tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1)}
              </h1>
              <p className="text-xl text-white/90">
                {tag?.description || `Games tagged with ${tagSlug}`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>
                  {totalCount
                    ? `${totalCount.toLocaleString()} games`
                    : `${games.length} games found`}
                </span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                #{tagSlug}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => router.push(`/game/${game.id}`)}
            className="relative group cursor-pointer rounded-3xl overflow-hidden bg-black/20  transition-all duration-300"
          >
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
                <Play size={16} fill="white" />
              </button>
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors">
                <Heart size={16} />
              </button>
            </div>

            {/* Tag Badge */}
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              #{tagSlug}
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

      {/* Related Tags */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Related Tags</h2>
        <div className="flex flex-wrap gap-3">
          {games
            .slice(0, 5)
            .flatMap((game) => game.tags.slice(0, 3))
            .filter(
              (tag, index, self) =>
                index === self.findIndex((t) => t.name === tag.name) &&
                tag.name.toLowerCase() !== tagSlug.toLowerCase()
            )
            .slice(0, 10)
            .map((relatedTag) => (
              <button
                key={relatedTag.name}
                onClick={() =>
                  router.push(
                    `/tags/${relatedTag.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                #{relatedTag.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TagGamesGrid;
