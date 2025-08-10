"use client";
import React from "react";
import Image from "next/image";
import { Star, Calendar, Play, Heart, Users } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: Array<{ name: string }>;
  platforms: Array<{ platform: { name: string } }>;
  metacritic: number;
  playtime?: number;
  added?: number;
}

interface LatestGameCardProps {
  game: Game;
  viewMode?: "grid" | "list";
  onClick: () => void;
  showNewBadge?: boolean;
}

const LatestGameCard: React.FC<LatestGameCardProps> = ({ game, onClick }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(game.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    await toggleFavorite(game);
  };

  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer rounded-3xl overflow-hidden bg-black/20 transition-all duration-300"
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
        <button 
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full transition-colors ${
            favorite 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white'
          }`}
        >
          <Heart size={16} className={favorite ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Favorite Indicator - Always visible if favorited */}
      {favorite && (
        <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded-full shadow-lg">
          <Heart size={14} className="fill-current" />
        </div>
      )}

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
          {game.added && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{(game.added / 1000).toFixed(0)}k</span>
            </div>
          )}
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
  );
};

export default LatestGameCard;