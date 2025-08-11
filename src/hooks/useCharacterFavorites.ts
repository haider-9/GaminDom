import { useState, useEffect, useCallback } from 'react';
import { characterApi } from '@/lib/api-client';
import { showToast } from '@/lib/toast-config';

interface Character {
    _id?: string;
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
}

export const useCharacterFavorites = (userId: string | null) => {
    const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchFavoriteCharacters = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const response = await characterApi.getFavoriteCharacters(userId) as { success?: boolean; favoriteCharacters?: Character[] };
            if (response?.success) {
                setFavoriteCharacters(response.favoriteCharacters || []);
            }
        } catch (error) {
            console.error('Error fetching favorite characters:', error);
            showToast.error('Failed to load favorite characters');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchFavoriteCharacters();
        }
    }, [userId, fetchFavoriteCharacters]);

    const addToFavorites = async (character: Omit<Character, '_id'>) => {
        if (!userId) {
            showToast.error('Please log in to favorite characters');
            return false;
        }

        try {
            const response = await characterApi.addToFavorites(userId, character) as { success?: boolean; character?: Character };
            if (response?.success && response.character) {
                setFavoriteCharacters(prev => [...prev, response.character!]);
                showToast.success('Character added to favorites');
                return true;
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            showToast.error('Failed to add character to favorites');
        }
        return false;
    };

    const removeFromFavorites = async (characterId: string) => {
        if (!userId) return false;

        try {
            const response = await characterApi.removeFromFavorites(userId, characterId) as { success?: boolean };
            if (response?.success) {
                setFavoriteCharacters(prev => prev.filter(char => char._id !== characterId));
                showToast.success('Character removed from favorites');
                return true;
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
            showToast.error('Failed to remove character from favorites');
        }
        return false;
    };

    const isFavorited = (characterName: string, gameId: string) => {
        return favoriteCharacters.some(
            char => char.name === characterName && char.gameId === gameId
        );
    };

    const getFavoriteCharacter = (characterName: string, gameId: string) => {
        return favoriteCharacters.find(
            char => char.name === characterName && char.gameId === gameId
        );
    };

    return {
        favoriteCharacters,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorited,
        getFavoriteCharacter,
        refetch: fetchFavoriteCharacters
    };
};