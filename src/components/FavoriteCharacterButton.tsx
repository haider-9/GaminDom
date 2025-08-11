"use client";
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useCharacterFavorites } from '@/hooks/useCharacterFavorites';
import { showToast } from '@/lib/toast-config';

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
    <button
      onClick={toggleFavorite}
      disabled={isDisabled}
      title={isCharacterFavorited ? `Remove ${character.name} from favorites` : `Add ${character.name} to favorites`}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isCharacterFavorited
          ? 'bg-[#bb3b3b] text-white hover:bg-[#d14d4d] shadow-lg'
          : 'bg-[#2a1a1a] text-[#d1c0c0] hover:bg-[#3a1a1a] hover:text-white border border-[#3a1a1a] hover:border-[#bb3b3b]'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} ${className}`}
    >
      <Heart
        size={16}
        className={`transition-all duration-200 ${
          isCharacterFavorited ? 'fill-current text-white' : 'text-current'
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
  );
};

export default FavoriteCharacterButton;