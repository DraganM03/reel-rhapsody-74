import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import MovieCard from '@/components/movies/MovieCard';
import { Plus, Clock } from 'lucide-react';
import { Movie } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setWatchlist(storedWatchlist);
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
          <div className="flex items-center space-x-3 mb-8">
            <Clock className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">My Watchlist</h1>
          </div>
          
          {watchlist.length > 0 && (
            <p className="text-muted-foreground text-lg">
              {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} to watch
            </p>
          )}
        </div>

        {/* Movies Grid */}
        <div className="container mx-auto px-4 pb-16">
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {watchlist.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onPlay={handlePlayMovie}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Your watchlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add movies to your watchlist to watch them later
              </p>
              <a 
                href="/discover" 
                className="text-primary hover:text-primary/80 font-medium"
              >
                Discover movies →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;