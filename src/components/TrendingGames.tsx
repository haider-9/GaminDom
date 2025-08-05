"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingUp, Star, Calendar, Users } from "lucide-react";
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

const TrendingGames = () => {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingGames = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
        const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

        const response = await fetch(
          `${apiUrl}?key=${apiKey}&ordering=-added&page_size=6&metacritic=70,100`
        );

        if (!response.ok) throw new Error("Failed to fetch trending games");

        const data = await response.json();
        setGames(data.results);
      } catch (error) {
        console.error("Error fetching trending games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingGames();
  }, []);

  if (loading) {
    return (
      <div className="w-full mx-auto px-4 py-8">
        <div className="h-8 bg-surface rounded-3xl w-64 animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-surface rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-orange-500" size={32} />
          <h2 className="text-3xl font-bold text-primary">Trending Now</h2>
        </div>
        <button
          onClick={() => router.push('/trending')}
          className="text-orange-500 hover:text-orange-400 transition-colors text-lg font-semibold"
        >
          See More
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div
            key={game.id}
            onClick={() => router.push(`/game/${game.id}`)}
            className="relative group cursor-pointer rounded-3xl overflow-hidden bg-surface transition-all duration-300"
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

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2 line-clamp-1">{game.name}</h3>
              
              <div className="flex items-center gap-4 mb-3 text-sm text-white/80">
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

              <div className="flex flex-wrap gap-2">
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
    </div>
  );
};

export default TrendingGames;