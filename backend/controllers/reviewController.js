const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { getDBStatus } = require('../config/db');

// Helper to recalculate and update movie average rating in DB cache if exists
const updateMovieStats = async (movieId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { movieId: Number(movieId) } },
      {
        $group: {
          _id: '$movieId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Movie.findOneAndUpdate(
        { tmdbId: Number(movieId) },
        {
          averageRating: Number(stats[0].averageRating.toFixed(1)),
          totalReviews: stats[0].totalReviews,
        }
      );
    } else {
      await Movie.findOneAndUpdate(
        { tmdbId: Number(movieId) },
        {
          averageRating: 0,
          totalReviews: 0,
        }
      );
    }
  } catch (err) {
    console.error('Error updating movie stats:', err.message);
  }
};

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Please set up MONGODB_URI in backend/.env.',
    });
  }

  const { movieId, rating, reviewTitle, reviewText } = req.body;

  if (!movieId || !rating || !reviewTitle || !reviewText) {
    return res.status(400).json({
      success: false,
      message: 'Please provide movieId, rating, review title, and review text.',
    });
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be an integer or decimal between 1 and 10.',
    });
  }

  // Check if user already reviewed this movie
  const existingReview = await Review.findOne({
    userId: req.user._id,
    movieId: Number(movieId),
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already submitted a review for this movie. You can edit your existing review.',
      reviewId: existingReview._id,
    });
  }

  const review = await Review.create({
    userId: req.user._id,
    movieId: Number(movieId),
    rating: numericRating,
    reviewTitle: reviewTitle.trim(),
    reviewText: reviewText.trim(),
    helpfulUsers: [],
  });

  await updateMovieStats(movieId);

  const populated = await Review.findById(review._id).populate('userId', 'name avatar');

  res.status(201).json({
    success: true,
    message: 'Your review was published successfully!',
    review: populated,
  });
};

// @desc    Get all reviews for a movie
// @route   GET /api/reviews/:movieId
// @access  Public
const getMovieReviews = async (req, res) => {
  if (!getDBStatus()) {
    return res.json({
      success: true,
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    });
  }

  const { movieId } = req.params;
  const { sort = 'newest' } = req.query;

  let sortOption = { createdAt: -1 }; // newest
  if (sort === 'highest') {
    sortOption = { rating: -1, createdAt: -1 };
  } else if (sort === 'helpful') {
    sortOption = { helpfulUsers: -1, createdAt: -1 };
  }

  const reviews = await Review.find({ movieId: Number(movieId) })
    .populate('userId', 'name avatar')
    .sort(sortOption);

  // Calculate dynamic stats
  let averageRating = 0;
  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    averageRating = Number((sum / reviews.length).toFixed(1));
  }

  res.json({
    success: true,
    count: reviews.length,
    averageRating,
    totalReviews: reviews.length,
    reviews,
  });
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const { rating, reviewTitle, reviewText } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found.',
    });
  }

  // Ensure user owns this review
  if (review.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: You can only edit your own reviews.',
    });
  }

  if (rating !== undefined) {
    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 10) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 10.',
      });
    }
    review.rating = numericRating;
  }

  if (reviewTitle) review.reviewTitle = reviewTitle.trim();
  if (reviewText) review.reviewText = reviewText.trim();

  await review.save();
  await updateMovieStats(review.movieId);

  const populated = await Review.findById(review._id).populate('userId', 'name avatar');

  res.json({
    success: true,
    message: 'Review updated successfully.',
    review: populated,
  });
};

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found.',
    });
  }

  // Ensure user owns this review or is admin
  if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: You can only delete your own reviews.',
    });
  }

  const movieId = review.movieId;
  await Review.findByIdAndDelete(req.params.id);
  await updateMovieStats(movieId);

  res.json({
    success: true,
    message: 'Review deleted successfully.',
  });
};

// @desc    Toggle helpful vote on a review
// @route   POST /api/reviews/:id/helpful
// @access  Private
const toggleHelpful = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found.',
    });
  }

  const userIdStr = req.user._id.toString();
  const hasVoted = review.helpfulUsers.some((uid) => uid.toString() === userIdStr);

  if (hasVoted) {
    // Remove helpful vote
    review.helpfulUsers = review.helpfulUsers.filter((uid) => uid.toString() !== userIdStr);
  } else {
    // Add helpful vote
    review.helpfulUsers.push(req.user._id);
  }

  await review.save();

  res.json({
    success: true,
    isHelpful: !hasVoted,
    helpfulCount: review.helpfulUsers.length,
    message: !hasVoted ? 'Marked review as helpful.' : 'Removed helpful vote.',
  });
};

module.exports = {
  createReview,
  getMovieReviews,
  updateReview,
  deleteReview,
  toggleHelpful,
};
