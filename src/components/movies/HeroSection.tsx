import { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '@/lib/tmdb';
import { Movie } from '@/types/movie';

interface HeroSectionProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onMoreInfo?: (movie: Movie) => void;
}

const HeroSection = ({ movie, onPlay, onMoreInfo }: HeroSectionProps) => {
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) return null;

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, 'backdrop')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-lg space-y-6">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {movie.title}
          </h1>

          {/* Rating and Year */}
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              ⭐ {movie.vote_average.toFixed(1)}
            </Badge>
            <span className="text-white text-lg">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>

          {/* Overview */}
          <p className="text-white/90 text-lg leading-relaxed line-clamp-3 max-w-md">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              onClick={() => onPlay?.(movie)}
              className="bg-white text-black hover:bg-white/80 font-semibold"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Play
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onMoreInfo?.(movie)}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Audio Control */}
      <div className="absolute bottom-8 right-8 z-20">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsMuted(!isMuted)}
          className="bg-black/20 border border-white/30 text-white hover:bg-black/40"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;