import React from 'react';
import { Link } from 'react-router-dom';
import { Info, Bookmark, Star, Play, Check } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import RatingBadge from './RatingBadge';

const Hero = ({ movie }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (!movie) {
    return (
      <div className="hero-skeleton">
        <div className="hero-skeleton-shimmer"></div>
      </div>
    );
  }

  const movieId = movie.id || movie.tmdbId;
  const inWatchlist = isInWatchlist(movieId);
  const rating = movie.rating || movie.vote_average || 0;
  const year = movie.releaseYear || (movie.releaseDate ? movie.releaseDate.substring(0, 4) : '');

  return (
    <div className="hero-section">
      {/* Background Backdrop Image */}
      <div className="hero-backdrop-container">
        <img
          src={movie.backdropPath || movie.posterPath}
          alt={movie.title}
          className="hero-backdrop-img"
        />
        <div className="hero-vignette"></div>
        <div className="hero-bottom-fade"></div>
      </div>

      {/* Hero Content */}
      <div className="hero-content-wrapper app-container">
        <div className="hero-content">
          {/* Spotlight Tag */}
          <div className="hero-tag">
            <span className="hero-tag-dot"></span>
            <span>FEATURED SPOTLIGHT</span>
          </div>

          <h1 className="hero-title">{movie.title}</h1>

          {/* Metadata Badges */}
          <div className="hero-meta">
            <RatingBadge rating={rating} size="lg" showMax />
            {year && <span className="hero-meta-pill">{year}</span>}
            {movie.runtime > 0 && <span className="hero-meta-pill">{movie.runtime}m</span>}
            {Array.isArray(movie.genres) &&
              movie.genres.slice(0, 3).map((g) => (
                <span key={g} className="hero-genre-pill">
                  {g}
                </span>
              ))}
          </div>

          {/* Description */}
          <p className="hero-description">
            {movie.overview ||
              'Explore this cinematic masterpiece on CineReview. Read genuine community reviews and share your own ratings.'}
          </p>

          {/* Hero Action Buttons */}
          <div className="hero-actions">
            <Link to={`/movie/${movieId}`} className="btn btn-primary btn-hero">
              <Info size={18} />
              <span>View Details</span>
            </Link>

            <button
              onClick={() => toggleWatchlist(movie)}
              className={`btn btn-secondary btn-hero ${inWatchlist ? 'btn-active' : ''}`}
            >
              {inWatchlist ? (
                <>
                  <Check size={18} className="text-emerald-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
