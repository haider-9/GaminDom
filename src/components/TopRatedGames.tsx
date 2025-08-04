"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: Array<{ name: string }>;
  metacritic: number;
  ratings_count: number;
}

const TopRatedGames = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedGames = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&ordering=-metacritic&page_size=5&metacritic=85,100`
        );

        if (!response.ok) throw new Error("Failed to fetch top rated games");

        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error("Error fetching top rated games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedGames();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 bg-black/50 rounded-3xl w-64 animate-pulse mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 bg-black/50 rounded-3xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="text-yellow-500" size={32} />
          <h2 className="text-3xl font-bold text-white">Top Rated</h2>
        </div>
        <button
          onClick={() => router.push("/top-rated")}
          className="text-yellow-500 hover:text-yellow-400 transition-colors text-lg font-semibold"
        >
          See More
        </button>
      </div>

      <div className="space-y-4">
        {games.map((game, index) => (
          <div
            key={game.id}
            onClick={() => router.push(`/game/${game.id}`)}
            className="flex items-center gap-4 p-4 bg-black/20 rounded-3xl hover:bg-black/30 transition-all duration-300 cursor-pointer group"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">#{index + 1}</span>
            </div>

            {/* Game Image */}
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={game.background_image || "/placeholder-game.jpg"}
                alt={game.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Game Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg line-clamp-1 mb-1">
                {game.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{game.rating.toFixed(1)}</span>
                </div>
                <span>{new Date(game.released).getFullYear()}</span>
                <span>{game.genres[0]?.name}</span>
              </div>
            </div>

            {/* Metacritic Score */}
            <div className="flex-shrink-0 md:block hidden">
              <div className="bg-green-500 text-white px-3 py-2 rounded-full font-bold">
                {game.metacritic}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedGames;
