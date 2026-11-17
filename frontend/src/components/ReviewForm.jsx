import React, { useState, useEffect } from 'react';
import { Star, Send, X } from 'lucide-react';

const ReviewForm = ({
  movieId,
  initialData = null,
  onSubmit,
  onCancel = null,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 8);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState(initialData?.reviewTitle || '');
  const [reviewText, setReviewText] = useState(initialData?.reviewText || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 8);
      setReviewTitle(initialData.reviewTitle || '');
      setReviewText(initialData.reviewText || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!rating || rating < 1 || rating > 10) {
      setError('Please select a rating between 1 and 10.');
      return;
    }

    if (!reviewTitle.trim()) {
      setError('Please enter a review title.');
      return;
    }

    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setError('Please write at least 10 characters for your review thoughts.');
      return;
    }

    onSubmit({
      movieId: Number(movieId),
      rating: Number(rating),
      reviewTitle: reviewTitle.trim(),
      reviewText: reviewText.trim(),
    });
  };

  return (
    <div className="review-form-card">
      <div className="review-form-header">
        <h3 className="review-form-title">
          {initialData ? 'Edit Your Review' : 'Write a Community Review'}
        </h3>
        {onCancel && (
          <button onClick={onCancel} className="btn-icon-close" title="Cancel edit">
            <X size={18} />
          </button>
        )}
      </div>

      {error && <div className="form-error-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="review-form">
        {/* Rating Selector (1 to 10) */}
        <div className="rating-select-group">
          <label className="form-label">
            Your Rating: <strong className="rating-score-highlight">{hoverRating || rating} / 10</strong>
          </label>
          <div className="rating-number-bubbles">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = rating === num;
              const isHovered = hoverRating >= num;
              return (
                <button
                  type="button"
                  key={num}
                  onClick={() => setRating(num)}
                  onMouseEnter={() => setHoverRating(num)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`rating-bubble ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                >
                  <Star size={12} className={isSelected || isHovered ? 'fill-current' : ''} />
                  <span>{num}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Title */}
        <div className="form-group">
          <label htmlFor="reviewTitle" className="form-label">
            Review Title
          </label>
          <input
            id="reviewTitle"
            type="text"
            placeholder="e.g. An absolute cinematic marvel, unforgettable visuals!"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            maxLength={100}
            className="form-input"
            required
          />
        </div>

        {/* Review Description */}
        <div className="form-group">
          <div className="label-with-count">
            <label htmlFor="reviewText" className="form-label">
              Detailed Review
            </label>
            <span className="char-count">{reviewText.length} / 2000</span>
          </div>
          <textarea
            id="reviewText"
            rows={4}
            placeholder="What did you love or dislike about the story, performances, cinematography, direction, and score? Share your genuine thoughts with the CineReview community..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={2000}
            className="form-textarea"
            required
          />
        </div>

        {/* Actions */}
        <div className="review-form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn btn-ghost">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-submit-review"
          >
            <Send size={16} />
            <span>{isSubmitting ? 'Publishing...' : initialData ? 'Update Review' : 'Submit Review'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
