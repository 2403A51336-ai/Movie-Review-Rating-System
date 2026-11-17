const User = require('../models/User');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const { getDBStatus } = require('../config/db');

// @desc    Get user profile with stats and reviews
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Fetch reviews written by this user
  const reviews = await Review.find({ userId: req.user._id }).sort({ createdAt: -1 });

  // Fetch watchlist count
  const watchlist = await Watchlist.findOne({ userId: req.user._id });
  const watchlistCount = watchlist ? watchlist.movies.length : 0;

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
    stats: {
      totalReviews: reviews.length,
      watchlistCount,
    },
    reviews,
  });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  // Update name if provided
  if (req.body.name) {
    user.name = req.body.name.trim();
  }

  // Update avatar if provided
  if (req.body.avatar) {
    user.avatar = req.body.avatar.trim();
  }

  // Update password if provided
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }
    user.password = req.body.password;
  }

  // Role modification is explicitly prohibited
  // user.role is untouched

  const updatedUser = await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully!',
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt,
    },
  });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
