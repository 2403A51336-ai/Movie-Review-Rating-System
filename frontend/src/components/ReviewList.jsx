import React from 'react';
import { Star, MessageSquare, ArrowUpDown } from 'lucide-react';
import ReviewCard from './ReviewCard';

const ReviewList = ({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  sortBy = 'newest',
  onSortChange,
  onEditReview,
  onDeleteReview,
}) => {
  return (
    <div className="review-list-section">
      {/* Reviews Header & Filters */}
      <div className="reviews-header-bar">
        <div className="reviews-title-group">
          <h3 className="section-title flex items-center gap-2">
            <MessageSquare size={20} className="text-purple-400" />
            <span>Community Reviews</span>
            <span className="reviews-count-pill">{totalReviews}</span>
          </h3>

          {totalReviews > 0 && (
            <div className="reviews-summary-score">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">{averageRating.toFixed(1)}</span>
              <span className="text-slate-400 text-xs">/10 CineReview Avg</span>
            </div>
          )}
        </div>

        {/* Sort Controls */}
        {totalReviews > 1 && (
          <div className="reviews-sort-container">
            <ArrowUpDown size={14} className="text-slate-400" />
            <span className="sort-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange && onSortChange(e.target.value)}
              className="select-dropdown"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        )}
      </div>

      {/* Reviews Content */}
      {reviews.length === 0 ? (
        <div className="empty-reviews-state">
          <MessageSquare size={40} className="empty-icon text-slate-600" />
          <h4 className="empty-title">No reviews yet for this movie</h4>
          <p className="empty-subtitle">
            Be the very first film lover to share your review and score!
          </p>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={onEditReview}
              onDelete={onDeleteReview}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
