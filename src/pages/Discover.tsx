import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import MovieCard from '@/components/movies/MovieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { tmdbService, mockMovies } from '@/lib/tmdb';
import { Movie } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';

const Discover = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const { toast } = useToast();

  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '18', name: 'Drama' },
    { id: '27', name: 'Horror' },
    { id: '878', name: 'Sci-Fi' },
    { id: '53', name: 'Thriller' },
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, searchQuery, selectedGenre]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const [popular, topRated, trending] = await Promise.all([
        tmdbService.getPopularMovies(),
        tmdbService.getTopRatedMovies(),
        tmdbService.getTrending(),
      ]);

      // Combine and deduplicate movies
      const allMovies = [
        ...popular.results,
        ...topRated.results,
        ...trending.results,
      ];
      
      const uniqueMovies = allMovies.filter(
        (movie, index, self) => self.findIndex(m => m.id === movie.id) === index
      );

      setMovies(uniqueMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies(mockMovies);
      toast({
        title: "Using demo data",
        description: "Add your TMDB API key to see real movie data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.overview.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(movie =>
        movie.genre_ids.includes(parseInt(selectedGenre))
      );
    }

    setFilteredMovies(filtered);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const searchResults = await tmdbService.searchMovies(searchQuery);
      setMovies(searchResults.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      toast({
        title: "Search failed",
        description: "Using local search instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayMovie = (movie: Movie) => {
    toast({
      title: "Playing movie",
      description: `Now playing: ${movie.title}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-8">Discover Movies</h1>
          
          {/* Search and Filters */}
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-lg bg-muted/50 border-muted"
                />
              </div>
              <Button 
                onClick={handleSearch}
                size="lg"
                className="bg-primary hover:bg-primary/80 text-primary-foreground"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Genre Filters */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filter by Genre:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant={selectedGenre === genre.id ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      selectedGenre === genre.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary/80"
                    }`}
                    onClick={() => setSelectedGenre(genre.id)}
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="container mx-auto px-4 pb-16">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading movies...</p>
              </div>
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onPlay={handlePlayMovie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No movies found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;