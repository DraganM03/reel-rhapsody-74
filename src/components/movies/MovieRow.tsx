import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlayMovie?: (movie: Movie) => void;
}

const MovieRow = ({ title, movies, onPlayMovie }: MovieRowProps) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4 px-4">{title}</h2>
      <div className="px-4">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-48">
              <MovieCard movie={movie} onPlay={onPlayMovie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieRow;