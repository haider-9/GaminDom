"use client";
import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/contexts/FavoritesContext';

interface Game {
  id: number;
  name: string;
  background_image?: string;
  rating?: number;
  released?: string;
  platforms?: unknown[];
  genres?: unknown[];
  description?: string;
}

interface FavoriteButtonProps {
  game: Game;
  size?: number;
  className?: string;
  showText?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  game, 
  size = 20, 
  className = "",
  showText = false 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(game.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(game);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center gap-2 p-2 rounded-full transition-all duration-150
        ${favorite 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        cursor-pointer
        ${className}
      `}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        animate={{ scale: favorite ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Heart 
          size={size} 
          className={`transition-all duration-150 ${
            favorite ? 'fill-current' : ''
          }`}
        />
      </motion.div>
      {showText && (
        <span className="text-sm font-medium">
          {favorite ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </motion.button>
  );
};

export default FavoriteButton;