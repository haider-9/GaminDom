"use client";
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useCharacterFavorites } from '@/hooks/useCharacterFavorites';
import { showToast } from '@/lib/toast-config';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface FavoriteCharacterButtonProps {
  character: {
    id?: string;
    name: string;
    gameId: string;
    gameTitle: string;
    description?: string;
    image?: string;
    aliases?: string[];
    gender?: string;
    origin?: string;
    giantBombId?: string;
    rawgId?: string;
  };
  userId: string;
  className?: string;
}

const FavoriteCharacterButton: React.FC<FavoriteCharacterButtonProps> = ({
  character,
  userId,
  className = ""
}) => {
  const [loading, setLoading] = useState(false);
  
  const {
    isFavorited,
    getFavoriteCharacter,
    addToFavorites,
    removeFromFavorites,
    loading: favoritesLoading
  } = useCharacterFavorites(userId);

  const isCharacterFavorited = isFavorited(character.name, character.gameId);

  const toggleFavorite = async () => {
    if (!userId) {
      showToast.error('Please log in to favorite characters');
      return;
    }

    if (loading || favoritesLoading) {
      return; // Prevent multiple simultaneous requests
    }

    setLoading(true);
    try {
      if (isCharacterFavorited) {
        // Remove from favorites
        const favoriteChar = getFavoriteCharacter(character.name, character.gameId);
        if (favoriteChar?._id) {
          const success = await removeFromFavorites(favoriteChar._id);
          if (success) {
            showToast.success(`${character.name} removed from favorites`);
          }
        } else {
          showToast.error('Could not find character in favorites');
        }
      } else {
        // Add to favorites
        const success = await addToFavorites(character);
        if (success) {
          showToast.success(`${character.name} added to favorites`);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast.error('Failed to update favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || favoritesLoading;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={toggleFavorite}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isCharacterFavorited
              ? 'accent-bg text-text-inverse hover:bg-primary-hover shadow-lg'
              : 'bg-surface-secondary text-secondary hover:bg-surface-tertiary hover:text-primary border border-background-quaternary hover:border-primary'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} ${className}`}
        >
          <Heart
            size={16}
            className={`transition-all duration-200 ${
              isCharacterFavorited ? 'fill-current text-text-inverse' : 'text-current'
            } ${loading ? 'animate-pulse' : ''}`}
          />
          <span className="font-medium">
            {loading || favoritesLoading 
              ? 'Loading...' 
              : isCharacterFavorited 
                ? 'Favorited' 
                : 'Add to Favorites'
            }
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isCharacterFavorited ? `Remove ${character.name} from favorites` : `Add ${character.name} to favorites`}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default FavoriteCharacterButton;