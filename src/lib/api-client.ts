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

// News API functions
export const newsApi = {
  // Get gaming news
  getGamingNews: async (params: {
    q?: string;
    category?: string;
    page?: number;
    pageSize?: number;
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  } = {}) => {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_NEWS_API_URL || 'https://newsapi.org/v2';
    
    if (!apiKey) {
      throw new Error('NewsAPI key not configured');
    }

    const searchParams = new URLSearchParams({
      apiKey,
      language: 'en',
      sortBy: params.sortBy || 'publishedAt',
      page: String(params.page || 1),
      pageSize: String(params.pageSize || 20),
    });

    // If specific query is provided, use everything endpoint
    if (params.q) {
      searchParams.append('q', params.q);
      const url = `${baseUrl}/everything?${searchParams.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }
      return await response.json();
    }

    // Otherwise use top-headlines with gaming-related sources
    const gamingSources = [
      'ign',
      'polygon',
      'gamespot',
      'kotaku',
      'the-verge',
      'techcrunch',
      'engadget',
      'ars-technica'
    ].join(',');

    searchParams.delete('q'); // Remove query param for top-headlines
    searchParams.append('sources', gamingSources);
    
    const url = `${baseUrl}/top-headlines?${searchParams.toString()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }
    return await response.json();
  },

  // Search news by category
  searchNewsByCategory: async (category: string, page: number = 1, pageSize: number = 20) => {
    const categoryQueries: Record<string, string> = {
      gaming: 'gaming OR "video games" OR esports OR "game development"',
      pc: '"PC gaming" OR Steam OR "Epic Games" OR "PC games"',
      console: 'PlayStation OR Xbox OR Nintendo OR "console gaming"',
      mobile: '"mobile gaming" OR "iOS games" OR "Android games" OR "mobile games"',
      esports: 'esports OR "competitive gaming" OR tournaments OR "professional gaming"',
      industry: '"game industry" OR "gaming industry" OR "game development" OR "gaming business"'
    };

    const query = categoryQueries[category] || categoryQueries.gaming;
    
    return newsApi.getGamingNews({
      q: query,
      page,
      pageSize,
      sortBy: 'publishedAt'
    });
  },
};

// Export default client for custom requests
export default apiClient;