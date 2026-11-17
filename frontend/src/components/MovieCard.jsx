import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import RatingBadge from './RatingBadge';

const MovieCard = ({ movie }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id || movie.tmdbId);

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const movieId = movie.id || movie.tmdbId;
  const rating = movie.rating || movie.vote_average || 0;
  const year = movie.releaseYear || (movie.releaseDate ? movie.releaseDate.substring(0, 4) : '');

  return (
    <div className="movie-card group">
      <Link to={`/movie/${movieId}`} className="movie-card-link">
        {/* Poster Container */}
        <div className="movie-poster-wrapper">
          <img
            src={movie.posterPath || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'}
            alt={movie.title}
            className="movie-poster-img"
            loading="lazy"
          />
          <div className="movie-poster-overlay"></div>

          {/* Top Floating Badges */}
          <div className="movie-top-badges">
            <RatingBadge rating={rating} size="sm" />
            <button
              onClick={handleWatchlistClick}
              className={`watchlist-quick-btn ${inWatchlist ? 'active' : ''}`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark size={15} className={inWatchlist ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Bottom Card Info Overlay */}
          <div className="movie-info-overlay">
            <span className="movie-overlay-cta">View Details &rarr;</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="movie-card-body">
          <h3 className="movie-card-title" title={movie.title}>
            {movie.title}
          </h3>
          <div className="movie-card-meta">
            {year && <span className="movie-card-year">{year}</span>}
            {Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <span className="movie-card-genre">{movie.genres[0]}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
