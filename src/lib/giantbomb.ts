import { handleNetworkError, handleApiError } from "./toast-config";

// GiantBomb API utility functions using Next.js API routes
export interface Character {
  id: number;
  name: string;
  real_name?: string;
  deck?: string;
  description?: string;
  birthday?: string;
  image?: {
    icon_url: string;
    medium_url: string;
    screen_url: string;
    small_url: string;
    super_url: string;
    thumb_url: string;
    tiny_url: string;
    original_url: string;
  };
  aliases?: string;
  gender?: number;
  site_detail_url: string;
  api_detail_url: string;
  games?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  concepts?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  locations?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  friends?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
  enemies?: Array<{
    id: number;
    name: string;
    api_detail_url: string;
    site_detail_url: string;
  }>;
}

export const getCharacterDetails = async (
  characterId: number
): Promise<Character | null> => {
  try {
    const response = await fetch(`/api/characters/${characterId}`);

    if (!response.ok) {
      handleApiError(response, "Failed to load character details");
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.character || null;
  } catch (error) {
    console.error("Error fetching character details:", error);

    if (error instanceof Error && !error.message.includes("HTTP error")) {
      handleNetworkError(error);
    }

    return null;
  }
};

export const getCharactersForGame = async (
  gameSlug: string
): Promise<Character[]> => {
  try {
    const response = await fetch(
      `/api/characters/search?gameSlug=${encodeURIComponent(gameSlug)}`
    );

    if (!response.ok) {
      handleApiError(response, "Failed to load game characters");
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.characters || [];
  } catch (error) {
    console.error("Error fetching characters for game:", error);

    if (error instanceof Error && !error.message.includes("HTTP error")) {
      handleNetworkError(error);
    }

    return [];
  }
};
