import { useState } from 'react';
import { Heart, Plus, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '@/lib/tmdb';
import { Movie } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
}

const MovieCard = ({ movie, onPlay }: MovieCardProps) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some((fav: Movie) => fav.id === movie.id);
  });
  
  const [isInWatchlist, setIsInWatchlist] = useState(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    return watchlist.some((item: Movie) => item.id === movie.id);
  });

  const { toast } = useToast();

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav: Movie) => fav.id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your favorites.`,
      });
    } else {
      const updatedFavorites = [...favorites, movie];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites.`,
      });
    }
  };

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (isInWatchlist) {
      const updatedWatchlist = watchlist.filter((item: Movie) => item.id !== movie.id);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsInWatchlist(false);
      toast({
        title: "Removed from watchlist",
        description: `${movie.title} has been removed from your watchlist.`,
      });
    } else {
      const updatedWatchlist = [...watchlist, movie];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsInWatchlist(true);
      toast({
        title: "Added to watchlist",
        description: `${movie.title} has been added to your watchlist.`,
      });
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onPlay?.(movie)}
              className="bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={toggleFavorite}
              className={`${
                isFavorite 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={toggleWatchlist}
              className={`${
                isInWatchlist 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rating badge */}
        <Badge variant="secondary" className="absolute top-2 left-2 bg-black/70 text-white">
          <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
          {movie.vote_average.toFixed(1)}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-1 text-foreground">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(movie.release_date).getFullYear()}
        </p>
      </div>
    </Card>
  );
};

export default MovieCard;