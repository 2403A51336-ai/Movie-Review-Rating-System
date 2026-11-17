const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    movieId: {
      type: Number,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 10'],
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10'],
    },
    reviewTitle: {
      type: String,
      required: [true, 'Please provide a review title'],
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters'],
    },
    reviewText: {
      type: String,
      required: [true, 'Please write your review thoughts'],
      trim: true,
      minlength: [10, 'Review text must be at least 10 characters long'],
      maxlength: [2000, 'Review text cannot exceed 2000 characters'],
    },
    helpfulUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound unique index: Ensure one review per user per movie
reviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
