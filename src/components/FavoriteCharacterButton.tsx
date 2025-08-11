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
    removeFromFavorites
  } = useCharacterFavorites(userId);

  const isCharacterFavorited = isFavorited(character.name, character.gameId);

  const toggleFavorite = async () => {
    if (!userId) {
      showToast.error('Please log in to favorite characters');
      return;
    }

    setLoading(true);
    try {
      if (isCharacterFavorited) {
        // Remove from favorites
        const favoriteChar = getFavoriteCharacter(character.name, character.gameId);
        if (favoriteChar?._id) {
          await removeFromFavorites(favoriteChar._id);
        }
      } else {
        // Add to favorites
        await addToFavorites(character);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isCharacterFavorited
          ? 'bg-[#bb3b3b] text-white hover:bg-[#d14d4d]'
          : 'bg-[#2a1a1a] text-[#d1c0c0] hover:bg-[#3a1a1a] hover:text-white border border-[#3a1a1a]'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <Heart
        size={16}
        className={isCharacterFavorited ? 'fill-current' : ''}
      />
      {loading ? 'Loading...' : isCharacterFavorited ? 'Favorited' : 'Add to Favorites'}
    </button>
  );
};

export default FavoriteCharacterButton;