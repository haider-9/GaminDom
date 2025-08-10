"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { showToast } from '@/lib/toast-config';

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

interface FavoritesContextType {
  favorites: Game[];
  isLoading: boolean;
  isFavorite: (gameId: number) => boolean;
  addToFavorites: (game: Game) => Promise<void>;
  removeFromFavorites: (gameId: number) => Promise<void>;
  toggleFavorite: (game: Game) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [isLoading] = useState(false);

  // Load favorites on mount and when auth changes
  useEffect(() => {
    let isMounted = true;
    
    const handleAuthChange = () => {
      if (isMounted) {
        loadFavorites();
      }
    };

    // Initial load
    if (isMounted) {
      loadFavorites();
    }

    // Listen for auth changes
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const loadFavorites = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setFavorites([]);
      return;
    }

    try {
      const user = JSON.parse(userData);
      const userId = user.id || user._id;

      if (!userId) return;

      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const userFavorites = data.user.favourites || [];

        // Convert MongoDB favorites to our Game format
        const formattedFavorites = userFavorites.map((fav: Record<string, unknown>) => ({
          id: fav.rawgId,
          name: fav.title,
          background_image: fav.image,
          rating: fav.rating,
          released: fav.released,
          platforms: fav.platforms,
          genres: fav.genres,
          description: fav.description,
        }));

        setFavorites(formattedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const isFavorite = (gameId: number): boolean => {
    return favorites.some(fav => fav.id === gameId);
  };

  const addToFavorites = async (game: Game): Promise<void> => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      showToast.error('Please log in to add favorites');
      return;
    }

    try {
      const user = JSON.parse(userData);
      const userId = user.id || user._id;

      if (!userId) {
        showToast.error('Please log in again');
        return;
      }

      // Optimistic update - add immediately to UI
      setFavorites(prev => [...prev, game]);
      showToast.success('Added to favorites!');

      const gameData = {
        title: game.name,
        description: game.description || '',
        rawgId: game.id,
        image: game.background_image || '',
        rating: game.rating || 0,
        released: game.released || null,
        platforms: game.platforms?.map(p => {
          const platform = p as Record<string, unknown>;
          return (platform.platform as Record<string, unknown>)?.name || platform.name;
        }).filter(Boolean) || [],
        genres: game.genres?.map(g => {
          const genre = g as Record<string, unknown>;
          return genre.name;
        }).filter(Boolean) || [],
      };

      const response = await fetch(`/api/users/${userId}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameData }),
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        setFavorites(prev => prev.filter(fav => fav.id !== game.id));
        const error = await response.json();
        showToast.error(error.error || 'Failed to add to favorites');
      }
    } catch (error) {
      // Revert optimistic update on error
      setFavorites(prev => prev.filter(fav => fav.id !== game.id));
      console.error('Error adding to favorites:', error);
      showToast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (gameId: number): Promise<void> => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    try {
      const user = JSON.parse(userData);
      const userId = user.id || user._id;

      if (!userId) return;

      // Store the game for potential rollback
      const gameToRemove = favorites.find(fav => fav.id === gameId);

      // Optimistic update - remove immediately from UI
      setFavorites(prev => prev.filter(fav => fav.id !== gameId));
      showToast.success('Removed from favorites');

      // Find the MongoDB game ID
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const userFavorites = data.user.favourites || [];
        const gameData = userFavorites.find((fav: Record<string, unknown>) => fav.rawgId === gameId);

        if (gameData) {
          const deleteResponse = await fetch(`/api/users/${userId}/favorites?gameId=${gameData._id}`, {
            method: 'DELETE',
          });

          if (!deleteResponse.ok) {
            // Revert optimistic update on failure
            if (gameToRemove) {
              setFavorites(prev => [...prev, gameToRemove]);
            }
            showToast.error('Failed to remove from favorites');
          }
        }
      } else {
        // Revert optimistic update on failure
        if (gameToRemove) {
          setFavorites(prev => [...prev, gameToRemove]);
        }
        showToast.error('Failed to remove from favorites');
      }
    } catch (error) {
      // Revert optimistic update on error
      const gameToRestore = favorites.find(fav => fav.id === gameId);
      if (gameToRestore) {
        setFavorites(prev => [...prev, gameToRestore]);
      }
      console.error('Error removing from favorites:', error);
      showToast.error('Failed to remove from favorites');
    }
  };

  const toggleFavorite = async (game: Game): Promise<void> => {
    if (isFavorite(game.id)) {
      await removeFromFavorites(game.id);
    } else {
      await addToFavorites(game);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        isFavorite,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};