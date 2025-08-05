import { ChevronRight, Star, Calendar, Gamepad2 } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: Array<{ name: string }>;
  platforms: Array<{ platform: { name: string } }>;
  metacritic: number;
}

async function fetchGames(): Promise<Game[]> {
  const apiKey = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_RAWG_API_URL;

  const response = await fetch(
    `${apiUrl}?key=${apiKey}&page_size=3&ordering=-added&metacritic=80,100`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!response.ok) {
    throw new Error("Failed to fetch games data");
  }

  const data = await response.json();
  return data.results;
}

const RecentGame = async () => {
  const gamesList = await fetchGames();

  return (
    <div className="space-y-3">
      {gamesList.map((game) => (
        <Link
          key={game.id}
          href={`/game/${game.id}`}
          className="flex items-center bg-black/50 p-3 rounded-3xl w-full lg:w-96 justify-between gap-4 hover:bg-black/70 transition-all duration-200 cursor-pointer"
        >
          <div>
            <div className="rounded-lg size-16 overflow-hidden">
              <Image
                src={
                  game.background_image ||
                  "https://dummyimage.com/64x64/666/fff?text=Game"
                }
                alt={game.name}
                width={64}
                height={64}
                className="object-cover object-center w-full h-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <h1 className="text-white text-lg font-bold truncate">
              {game.name}
            </h1>
            <p className="text-white/70 text-sm line-clamp-2">
              {game.platforms && game.platforms.length > 0
                ? `Available on ${game.platforms
                  .slice(0, 2)
                  .map((p) => p.platform.name)
                  .join(", ")}`
                : "Multi-platform game"}
            </p>

            {/* Game Info */}
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs font-semibold">
                  {game.rating ? game.rating.toFixed(1) : "N/A"}
                </span>
              </div>

              {game.released && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-blue-400" />
                  <span className="text-blue-400 text-xs">
                    {new Date(game.released).getFullYear()}
                  </span>
                </div>
              )}

              {game.metacritic && (
                <div className="flex items-center gap-1">
                  <Gamepad2 size={12} className="text-green-400" />
                  <span className="text-green-400 text-xs font-semibold">
                    {game.metacritic}
                  </span>
                </div>
              )}

              {game.genres && game.genres.length > 0 && (
                <span className="text-purple-400 text-xs bg-purple-500/20 px-2 py-0.5 rounded-full">
                  {game.genres[0].name}
                </span>
              )}
            </div>
          </div>

          <ChevronRight size={20} className="text-white/50" />
        </Link>
      ))}
    </div>
  );
};

export default RecentGame;