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

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const searchParams = params ? `?${new URLSearchParams(params).toString()}` : '';
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

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instances
export const apiClient = new ApiClient('/api/config');
export const authClient = new ApiClient('/api/auth');
export const charactersClient = new ApiClient('/api/characters');

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

// Export default client for custom requests
export default apiClient;