import { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/movies/HeroSection';
import MovieRow from '@/components/movies/MovieRow';
import Navbar from '@/components/layout/Navbar';
import { tmdbService, mockMovies } from '@/lib/tmdb';
import { Movie } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      
      // Fetch different categories
      const [trending, popular, topRated] = await Promise.all([
        tmdbService.getTrending(),
        tmdbService.getPopularMovies(),
        tmdbService.getTopRatedMovies(),
      ]);

      setTrendingMovies(trending.results);
      setPopularMovies(popular.results);
      setTopRatedMovies(topRated.results);
      
      // Set featured movie (first trending movie)
      if (trending.results.length > 0) {
        setFeaturedMovie(trending.results[0]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      // Use mock data as fallback
      setTrendingMovies(mockMovies);
      setPopularMovies(mockMovies);
      setTopRatedMovies(mockMovies);
      setFeaturedMovie(mockMovies[0]);
      
      toast({
        title: "Using demo data",
        description: "Add your TMDB API key to see real movie data.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRandomMovie = () => {
    const allMovies = [...trendingMovies, ...popularMovies, ...topRatedMovies];
    if (allMovies.length > 0) {
      const randomMovie = allMovies[Math.floor(Math.random() * allMovies.length)];
      setFeaturedMovie(randomMovie);
      toast({
        title: "Random pick!",
        description: `How about "${randomMovie.title}"?`,
      });
    }
  };

  const handlePlayMovie = (movie: Movie) => {
    toast({
      title: "Playing movie",
      description: `Now playing: ${movie.title}`,
    });
  };

  const handleMoreInfo = (movie: Movie) => {
    toast({
      title: "Movie details",
      description: `Showing details for: ${movie.title}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading movies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        {featuredMovie && (
          <HeroSection
            movie={featuredMovie}
            onPlay={handlePlayMovie}
            onMoreInfo={handleMoreInfo}
          />
        )}

        {/* Random Movie Button */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <Button
              onClick={getRandomMovie}
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Pick Random Movie
            </Button>
          </div>
        </div>

        {/* Movie Rows */}
        <div className="space-y-8 pb-16">
          <MovieRow
            title="Trending Now"
            movies={trendingMovies}
            onPlayMovie={handlePlayMovie}
          />
          <MovieRow
            title="Popular Movies"
            movies={popularMovies}
            onPlayMovie={handlePlayMovie}
          />
          <MovieRow
            title="Top Rated"
            movies={topRatedMovies}
            onPlayMovie={handlePlayMovie}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;