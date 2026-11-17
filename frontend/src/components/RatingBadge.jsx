import React from 'react';
import { Star } from 'lucide-react';

const RatingBadge = ({ rating, size = 'md', showMax = false }) => {
  const numRating = Number(rating) || 0;
  const formatted = numRating > 0 ? numRating.toFixed(1) : 'NR';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-bold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  // Color gradient based on score
  let badgeColorClass = 'badge-rating-mid';
  if (numRating >= 8.0) {
    badgeColorClass = 'badge-rating-high';
  } else if (numRating < 6.0 && numRating > 0) {
    badgeColorClass = 'badge-rating-low';
  }

  return (
    <div className={`rating-badge ${badgeColorClass} ${sizeClasses[size] || sizeClasses.md}`}>
      <Star size={iconSizes[size] || 14} className="star-icon fill-amber-400 text-amber-400" />
      <span>{formatted}</span>
      {showMax && numRating > 0 && <span className="rating-max">/10</span>}
    </div>
  );
};

export default RatingBadge;
