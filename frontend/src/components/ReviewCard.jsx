import React, { useState } from 'react';
import { ThumbsUp, Edit3, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as reviewService from '../services/reviewService';
import RatingBadge from './RatingBadge';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [helpfulUsers, setHelpfulUsers] = useState(review.helpfulUsers || []);
  const [isUpdatingHelpful, setIsUpdatingHelpful] = useState(false);

  const reviewAuthorId = review.userId?._id || review.userId;
  const isOwner = Boolean(user && user._id && reviewAuthorId && user._id.toString() === reviewAuthorId.toString());
  const canDelete = isOwner || isAdmin;

  const isHelpfulByMe = Boolean(
    user && helpfulUsers.some((uid) => (uid?._id || uid).toString() === user._id.toString())
  );

  const handleHelpfulClick = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to vote reviews as helpful.', 'info');
      return;
    }

    if (isUpdatingHelpful) return;

    try {
      setIsUpdatingHelpful(true);
      const res = await reviewService.toggleHelpful(review._id);
      if (res.success) {
        if (res.isHelpful) {
          setHelpfulUsers((prev) => [...prev, user._id]);
          showToast('Marked as helpful!', 'success');
        } else {
          setHelpfulUsers((prev) =>
            prev.filter((uid) => (uid?._id || uid).toString() !== user._id.toString())
          );
          showToast('Helpful vote removed.', 'info');
        }
      }
    } catch (err) {
      showToast(err.message || 'Could not update helpful vote.', 'error');
    } finally {
      setIsUpdatingHelpful(false);
    }
  };

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div className={`review-card ${isOwner ? 'review-card-owner' : ''}`}>
      <div className="review-card-header">
        {/* Author Info */}
        <div className="review-author-info">
          <img
            src={
              review.userId?.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
            }
            alt={review.userId?.name || 'Reviewer'}
            className="review-author-avatar"
          />
          <div>
            <div className="review-author-name-row">
              <span className="review-author-name">{review.userId?.name || 'CineReview User'}</span>
              {isOwner && <span className="owner-tag">You</span>}
              {review.userId?.role === 'admin' && (
                <span className="admin-author-badge" title="Verified CineReview Moderator">
                  <ShieldCheck size={12} /> Moderator
                </span>
              )}
            </div>
            <div className="review-date-row">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Rating Badge & Action Controls */}
        <div className="review-header-right">
          <RatingBadge rating={review.rating} size="md" showMax />

          {/* Edit / Delete for Owner or Admin */}
          {(isOwner || canDelete) && (
            <div className="review-management-btns">
              {isOwner && onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  className="btn-icon-action text-blue-400 hover:text-blue-300"
                  title="Edit your review"
                  aria-label="Edit review"
                >
                  <Edit3 size={15} />
                </button>
              )}
              {canDelete && onDelete && (
                <button
                  onClick={() => onDelete(review._id)}
                  className="btn-icon-action text-red-400 hover:text-red-300"
                  title={isOwner ? 'Delete your review' : 'Admin: Delete inappropriate review'}
                  aria-label="Delete review"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="review-body">
        <h4 className="review-title">{review.reviewTitle}</h4>
        <p className="review-text">{review.reviewText}</p>
      </div>

      {/* Footer / Helpful Button */}
      <div className="review-footer">
        <button
          onClick={handleHelpfulClick}
          disabled={isUpdatingHelpful}
          className={`btn-helpful ${isHelpfulByMe ? 'active' : ''}`}
          title={isHelpfulByMe ? 'Remove helpful vote' : 'Mark this review as helpful'}
        >
          <ThumbsUp size={14} className={isHelpfulByMe ? 'fill-current' : ''} />
          <span>Helpful</span>
          <span className="helpful-count">({helpfulUsers.length})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
