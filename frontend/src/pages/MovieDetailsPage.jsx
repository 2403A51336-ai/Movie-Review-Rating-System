import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Calendar,
  Bookmark,
  Check,
  Edit,
  User,
  Film,
  Sparkles,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import * as movieService from '../services/movieService';
import * as reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import RatingBadge from '../components/RatingBadge';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import Loader from '../components/Loader';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { showToast } = useToast();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsStats, setReviewsStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [reviewsSort, setReviewsSort] = useState('newest');

  const [loading, setLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const reviewSectionRef = useRef(null);

  // Fetch movie data & reviews
  const loadMovieAndReviews = useCallback(async () => {
    try {
      setLoading(true);
      const [movieData, reviewsData] = await Promise.all([
        movieService.getMovieDetails(id),
        reviewService.getMovieReviews(id, reviewsSort),
      ]);

      if (movieData.success && movieData.movie) {
        setMovie(movieData.movie);
      }

      if (reviewsData.success) {
        setReviews(reviewsData.reviews || []);
        setReviewsStats({
          averageRating: reviewsData.averageRating || 0,
          totalReviews: reviewsData.totalReviews || 0,
        });
      }
    } catch (err) {
      console.error('Error loading movie details:', err);
      showToast(err.message || 'Could not load movie information.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, reviewsSort, showToast]);

  useEffect(() => {
    loadMovieAndReviews();
  }, [loadMovieAndReviews]);

  // Check if current user has already submitted a review
  const myReview = user
    ? reviews.find((r) => (r.userId?._id || r.userId)?.toString() === user._id?.toString())
    : null;

  const handleCreateOrUpdateReview = async (formData) => {
    try {
      setIsSubmittingReview(true);
      if (editingReview) {
        // Update
        const res = await reviewService.updateReview(editingReview._id, formData);
        if (res.success) {
          showToast('Review updated successfully!', 'success');
          setEditingReview(null);
          setShowReviewForm(false);
          loadMovieAndReviews();
        }
      } else {
        // Create
        const res = await reviewService.createReview(formData);
        if (res.success) {
          showToast('Your review was published successfully!', 'success');
          setShowReviewForm(false);
          loadMovieAndReviews();
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await reviewService.deleteReview(reviewId);
      if (res.success) {
        showToast('Review deleted successfully.', 'info');
        loadMovieAndReviews();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete review', 'error');
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenReviewForm = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to write a movie review.', 'info');
      return;
    }
    if (myReview) {
      handleEditClick(myReview);
      return;
    }
    setEditingReview(null);
    setShowReviewForm(true);
    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading movie details & community reviews..." />;
  }

  if (!movie) {
    return (
      <div className="app-container py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
        <p className="text-slate-400 mb-6">The requested movie could not be located in the catalog.</p>
        <Link to="/movies" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Movies
        </Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id || movie.tmdbId);

  return (
    <div className="movie-details-page">
      {/* Hero Backdrop Banner */}
      <div className="details-hero">
        <div className="details-backdrop-wrap">
          <img
            src={movie.backdropPath || movie.posterPath}
            alt={movie.title}
            className="details-backdrop-img"
          />
          <div className="details-backdrop-vignette"></div>
        </div>

        {/* Back Link */}
        <div className="app-container details-back-wrap">
          <Link to="/movies" className="back-nav-link">
            <ArrowLeft size={16} />
            <span>Back to Browse</span>
          </Link>
        </div>

        {/* Details Content Card */}
        <div className="app-container details-content-container">
          <div className="details-layout-grid">
            {/* Left: Poster */}
            <div className="details-poster-col">
              <div className="details-poster-wrapper">
                <img
                  src={
                    movie.posterPath ||
                    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'
                  }
                  alt={movie.title}
                  className="details-poster-img"
                />
              </div>

              {/* Action Buttons on Mobile / Desktop */}
              <div className="details-sidebar-actions">
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className={`btn w-full btn-watchlist ${inWatchlist ? 'btn-active' : 'btn-secondary'}`}
                >
                  {inWatchlist ? (
                    <>
                      <Check size={18} className="text-emerald-400" />
                      <span>In Your Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Bookmark size={18} />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleOpenReviewForm}
                  className="btn btn-primary w-full btn-write-review"
                >
                  <Edit size={16} />
                  <span>{myReview ? 'Edit Your Review' : 'Write a Review'}</span>
                </button>
              </div>
            </div>

            {/* Right: Info */}
            <div className="details-info-col">
              <div className="details-header-info">
                <h1 className="details-movie-title">{movie.title}</h1>

                {/* Meta pills */}
                <div className="details-meta-row">
                  {movie.releaseDate && (
                    <span className="meta-pill">
                      <Calendar size={14} />
                      <span>{movie.releaseDate}</span>
                    </span>
                  )}
                  {movie.runtime > 0 && (
                    <span className="meta-pill">
                      <Clock size={14} />
                      <span>{movie.runtime} min</span>
                    </span>
                  )}
                  {movie.director && (
                    <span className="meta-pill text-purple-300">
                      <strong>Director:</strong> {movie.director}
                    </span>
                  )}
                </div>

                {/* Genre Tags */}
                {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                  <div className="details-genres-list">
                    {movie.genres.map((genre) => (
                      <span key={genre} className="genre-badge">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Dual Ratings Display: TMDB vs CineReview Community Rating */}
              <div className="details-ratings-card">
                <div className="rating-score-block">
                  <div className="rating-score-label">TMDB RATING</div>
                  <div className="rating-score-value">
                    <Star size={20} className="fill-amber-400 text-amber-400" />
                    <span className="score-num">{(movie.rating || movie.vote_average || 0).toFixed(1)}</span>
                    <span className="score-denom">/10</span>
                  </div>
                  <div className="rating-vote-count">
                    {movie.voteCount ? `${movie.voteCount.toLocaleString()} votes` : 'TMDB Score'}
                  </div>
                </div>

                <div className="rating-score-divider"></div>

                <div className="rating-score-block rating-score-cinereview">
                  <div className="rating-score-label">CINEREVIEW COMMUNITY</div>
                  <div className="rating-score-value">
                    <Sparkles size={20} className="text-purple-400" />
                    <span className="score-num text-purple-300">
                      {reviewsStats.totalReviews > 0
                        ? reviewsStats.averageRating.toFixed(1)
                        : (movie.cineReviewRating || 0) > 0
                        ? movie.cineReviewRating.toFixed(1)
                        : 'NR'}
                    </span>
                    <span className="score-denom">/10</span>
                  </div>
                  <div className="rating-vote-count">
                    {reviewsStats.totalReviews > 0
                      ? `${reviewsStats.totalReviews} community ${reviewsStats.totalReviews === 1 ? 'review' : 'reviews'}`
                      : 'No community reviews yet'}
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div className="details-overview-section">
                <h3 className="details-section-heading">Overview</h3>
                <p className="details-overview-text">
                  {movie.overview || 'No synopsis available for this title.'}
                </p>
              </div>

              {/* Cast */}
              {Array.isArray(movie.cast) && movie.cast.length > 0 && (
                <div className="details-cast-section">
                  <h3 className="details-section-heading">Top Cast</h3>
                  <div className="cast-scroll-grid">
                    {movie.cast.slice(0, 6).map((actor, idx) => (
                      <div key={idx} className="cast-card">
                        <img
                          src={
                            actor.profile_path ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={actor.name}
                          className="cast-avatar-img"
                        />
                        <div className="cast-name">{actor.name}</div>
                        <div className="cast-character">{actor.character || 'Cast'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="app-container reviews-main-container" ref={reviewSectionRef}>
        {/* Review Form (if opened or user editing) */}
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              movieId={movie.id || movie.tmdbId}
              initialData={editingReview}
              onSubmit={handleCreateOrUpdateReview}
              onCancel={() => {
                setShowReviewForm(false);
                setEditingReview(null);
              }}
              isSubmitting={isSubmittingReview}
            />
          </div>
        )}

        {/* Existing Reviews List */}
        <ReviewList
          reviews={reviews}
          averageRating={reviewsStats.averageRating}
          totalReviews={reviewsStats.totalReviews}
          sortBy={reviewsSort}
          onSortChange={(newSort) => setReviewsSort(newSort)}
          onEditReview={handleEditClick}
          onDeleteReview={handleDeleteReview}
        />
      </div>
    </div>
  );
};

export default MovieDetailsPage;
