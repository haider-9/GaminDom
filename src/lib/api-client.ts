import { handleNetworkError, handleApiError } from './toast-config';

// Base API client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        handleApiError(response, 'Request failed');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && !error.message.includes('HTTP error')) {
        handleNetworkError(error);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | undefined>): Promise<T> {
    // Filter out undefined values
    const filteredParams = params ? Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    ) : {};
    const searchParams = Object.keys(filteredParams).length > 0
      ? `?${new URLSearchParams(filteredParams as Record<string, string>).toString()}`
      : '';
    return this.request<T>(`${endpoint}${searchParams}`);
  }

  async post<T>(endpoint: string, data?: object): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: object): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: object): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create API client instances
export const apiClient = new ApiClient('/api/config');
export const authClient = new ApiClient('/api/auth');
export const charactersClient = new ApiClient('/api/characters');
export const newsClient = new ApiClient('/api');

// Game-related API functions
export const gameApi = {
  // Get game details
  getGameDetails: async (gameId: string) => {
    return apiClient.get(`/games`, { id: gameId, endpoint: 'details' });
  },

  // Get game screenshots
  getGameScreenshots: async (gameId: string) => {
    return apiClient.get(`/games`, { id: gameId, endpoint: 'screenshots' });
  },

  // Get games list with filters
  getGamesList: async (params: {
    page?: string;
    page_size?: string;
    ordering?: string;
    search?: string;
    genres?: string;
    platforms?: string;
    tags?: string;
    dates?: string;
    metacritic?: string;
  } = {}) => {
    return apiClient.get('/games/list', params);
  },

  // Get latest games
  getLatestGames: async (page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/games/list', {
      page,
      page_size: pageSize,
      ordering: '-released',
    });
  },

  // Get trending games
  getTrendingGames: async (page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/games/list', {
      page,
      page_size: pageSize,
      ordering: '-added',
    });
  },

  // Get top-rated games
  getTopRatedGames: async (page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/games/list', {
      page,
      page_size: pageSize,
      ordering: '-rating',
      metacritic: '80,100',
    });
  },

  // Search games
  searchGames: async (query: string, page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/games/list', {
      search: query,
      page,
      page_size: pageSize,
    });
  },

  // Get games by genre
  getGamesByGenre: async (genreSlug: string, page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/games/list', {
      genres: genreSlug,
      page,
      page_size: pageSize,
    });
  },

  // Get games by platform
  getGamesByPlatform: async (platformId: string, page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/games/list', {
      platforms: platformId,
      page,
      page_size: pageSize,
    });
  },

  // Get games by tag
  getGamesByTag: async (tagSlug: string, page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/games/list', {
      tags: tagSlug,
      page,
      page_size: pageSize,
    });
  },
};

// Metadata API functions
export const metadataApi = {
  // Get genres
  getGenres: async (page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/genres', { page, page_size: pageSize });
  },

  // Get platforms
  getPlatforms: async (page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/platforms', { page, page_size: pageSize });
  },

  // Get tags
  getTags: async (page: string = '1', pageSize: string = '20') => {
    return apiClient.get('/tags', { page, page_size: pageSize });
  },
};

// Character API functions
export const characterApi = {
  // Get characters for a game
  getCharactersForGame: async (gameSlug: string) => {
    return charactersClient.get('/search', { gameSlug });
  },

  // Get character details
  getCharacterDetails: async (characterId: string) => {
    return charactersClient.get(`/${characterId}`);
  },

  // Add character to favorites
  addToFavorites: async (userId: string, characterData: object) => {
    return charactersClient.post('/favorite', { userId, characterData });
  },

  // Remove character from favorites
  removeFromFavorites: async (userId: string, characterId: string) => {
    return charactersClient.delete('/favorite', { userId, characterId });
  },

  // Get user's favorite characters
  getFavoriteCharacters: async (userId: string) => {
    return charactersClient.get('/favorite', { userId });
  },
};

// Authentication API functions
export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    return authClient.post('/login', { email, password });
  },

  // Signup
  signup: async (username: string, email: string, password: string) => {
    return authClient.post('/signup', { username, email, password });
  },
};

// News API functions using GameSpot
export const newsApi = {
  // Get gaming news from GameSpot
  getGamingNews: async (params: {
    q?: string;
    category?: string;
    page?: number;
    pageSize?: number;
    sortBy?: 'publish_date' | 'update_date';
  } = {}) => {
    const requestParams: Record<string, string | undefined> = {
      page: String(params.page || 1),
      limit: String(params.pageSize || 12),
      sort: params.sortBy || 'publish_date:desc',
    };

    if (params.q) {
      requestParams.filter = `title:${params.q}`;
    }

    return newsClient.get('/news', requestParams);
  },

  // Search news by category (GameSpot doesn't have categories, so we'll use filters)
  searchNewsByCategory: async (category: string, page: number = 1, pageSize: number = 12) => {
    const categoryFilters: Record<string, string> = {
      gaming: '',
      pc: 'pc',
      console: 'playstation,xbox,nintendo-switch',
      mobile: 'mobile',
      esports: 'esports',
      industry: 'business'
    };

    const filter = categoryFilters[category];

    const requestParams: Record<string, string | undefined> = {
      page: String(page),
      limit: String(pageSize),
      sort: 'publish_date:desc',
    };

    if (filter) {
      requestParams.filter = `associations:${filter}`;
    }

    return newsClient.get('/news', requestParams);
  },
};

// Export default client for custom requests
export default apiClient;