import { Movie, TVShow, TMDBResponse, Genre } from '@/types/movie';

// For demo purposes, we'll use a public TMDB API key
// In production, this should be handled through a backend
const TMDB_API_KEY = ''; // Users will need to add their own API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image size configurations
export const IMAGE_SIZES = {
  poster: 'w500',
  backdrop: 'w1280',
  profile: 'w185',
} as const;

export const getImageUrl = (path: string, size: keyof typeof IMAGE_SIZES = 'poster') => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${IMAGE_SIZES[size]}${path}`;
};

// Mock data for demonstration - replace with actual API calls
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Matrix",
    overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    genre_ids: [28, 878],
  },
  {
    id: 2,
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-16",
    vote_average: 8.8,
    genre_ids: [28, 878, 53],
  },
];

export class TMDBService {
  private apiKey: string;

  constructor(apiKey: string = TMDB_API_KEY) {
    this.apiKey = apiKey;
  }

  private async fetchFromTMDB<T>(endpoint: string): Promise<T> {
    if (!this.apiKey) {
      // Return mock data when no API key is provided
      console.warn('No TMDB API key provided, using mock data');
      throw new Error('TMDB API key required');
    }

    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${this.apiKey}`);
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    return response.json();
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> {
    try {
      return await this.fetchFromTMDB(`/trending/movie/${timeWindow}`);
    } catch {
      return {
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: mockMovies.length,
      };
    }
  }

  async getPopularMovies(): Promise<TMDBResponse<Movie>> {
    try {
      return await this.fetchFromTMDB('/movie/popular');
    } catch {
      return {
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: mockMovies.length,
      };
    }
  }

  async getTopRatedMovies(): Promise<TMDBResponse<Movie>> {
    try {
      return await this.fetchFromTMDB('/movie/top_rated');
    } catch {
      return {
        page: 1,
        results: mockMovies,
        total_pages: 1,
        total_results: mockMovies.length,
      };
    }
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    try {
      return await this.fetchFromTMDB(`/movie/${movieId}`);
    } catch {
      return mockMovies[0];
    }
  }

  async searchMovies(query: string): Promise<TMDBResponse<Movie>> {
    try {
      return await this.fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
    } catch {
      return {
        page: 1,
        results: mockMovies.filter(movie => 
          movie.title.toLowerCase().includes(query.toLowerCase())
        ),
        total_pages: 1,
        total_results: mockMovies.length,
      };
    }
  }
}

export const tmdbService = new TMDBService();