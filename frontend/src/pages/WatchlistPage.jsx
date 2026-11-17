import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Film, ArrowRight, Star } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import RatingBadge from '../components/RatingBadge';
import Loader from '../components/Loader';

const WatchlistPage = () => {
  const { watchlist, watchlistCount, loading, removeFromWatchlist } = useWatchlist();

  if (loading) {
    return <Loader message="Loading your personal watchlist..." fullScreen />;
  }

  return (
    <div className="watchlist-page app-container">
      {/* Header */}
      <div className="watchlist-header">
        <div className="watchlist-title-wrap">
          <Bookmark size={28} className="text-purple-400" />
          <h1 className="page-heading">
            My <span className="text-gradient">Watchlist</span>
          </h1>
          <span className="watchlist-badge-count">{watchlistCount} saved</span>
        </div>
        <p className="page-subheading">
          Keep track of movies you plan to watch. Movies saved here are synchronized with your CineReview account.
        </p>
      </div>

      {/* Content */}
      {watchlist.length === 0 ? (
        <div className="empty-state-card">
          <Bookmark size={54} className="empty-icon text-slate-600" />
          <h3 className="empty-title">Your watchlist is empty</h3>
          <p className="empty-subtitle">
            Explore movies across trending, popular, and top-rated sections to add them to your personal queue.
          </p>
          <Link to="/movies" className="btn btn-primary mt-6">
            <Film size={16} />
            <span>Discover Movies</span>
          </Link>
        </div>
      ) : (
        <div className="movies-grid">
          {watchlist.map((movie) => {
            const year = movie.releaseDate ? movie.releaseDate.substring(0, 4) : '';
            return (
              <div key={movie.tmdbId} className="movie-card watchlist-item-card group">
                <Link to={`/movie/${movie.tmdbId}`} className="movie-card-link">
                  <div className="movie-poster-wrapper">
                    <img
                      src={
                        movie.posterPath ||
                        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'
                      }
                      alt={movie.title}
                      className="movie-poster-img"
                      loading="lazy"
                    />
                    <div className="movie-poster-overlay"></div>

                    <div className="movie-top-badges">
                      <RatingBadge rating={movie.rating} size="sm" />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromWatchlist(movie.tmdbId, movie.title);
                        }}
                        className="btn-watchlist-remove"
                        title="Remove from watchlist"
                        aria-label="Remove from watchlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="movie-info-overlay">
                      <span className="movie-overlay-cta">View Details &rarr;</span>
                    </div>
                  </div>

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
          })}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
