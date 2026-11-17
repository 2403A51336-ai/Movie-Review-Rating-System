const User = require('../models/User');
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { getDBStatus } = require('../config/db');

// @desc    Get admin dashboard metrics & stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboard = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const [totalUsers, totalReviews, totalMoviesCached, reviewRatingAgg] = await Promise.all([
    User.countDocuments(),
    Review.countDocuments(),
    Movie.countDocuments(),
    Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]),
  ]);

  const platformAvgRating =
    reviewRatingAgg.length > 0 ? Number(reviewRatingAgg[0].avgRating.toFixed(1)) : 0;

  // Recent 5 users
  const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);

  // Recent 5 reviews
  const recentReviews = await Review.find()
    .populate('userId', 'name email avatar')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalReviews,
      totalMovies: totalMoviesCached,
      platformAvgRating,
    },
    recentUsers,
    recentReviews,
  });
};

// @desc    Get all reviews platform-wide
// @route   GET /api/admin/reviews
// @access  Private (Admin only)
const getAllReviews = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const reviews = await Review.find()
    .populate('userId', 'name email avatar')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: reviews.length,
    reviews,
  });
};

// @desc    Delete any inappropriate review
// @route   DELETE /api/admin/reviews/:id
// @access  Private (Admin only)
const deleteAdminReview = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found.' });
  }

  const movieId = review.movieId;
  await Review.findByIdAndDelete(req.params.id);

  // Recalculate movie rating
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
  }

  res.json({
    success: true,
    message: 'Review successfully removed by administrator.',
  });
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.json({
    success: true,
    count: users.length,
    users,
  });
};

// @desc    Delete user account (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own admin account.',
    });
  }

  // Clean up user's reviews
  await Review.deleteMany({ userId: user._id });
  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User account and associated reviews removed.',
  });
};

module.exports = {
  getAdminDashboard,
  getAllReviews,
  deleteAdminReview,
  getAllUsers,
  deleteUser,
};
