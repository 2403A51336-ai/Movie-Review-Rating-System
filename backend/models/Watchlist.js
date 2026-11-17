const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    movies: [
      {
        tmdbId: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        posterPath: {
          type: String,
          default: '',
        },
        backdropPath: {
          type: String,
          default: '',
        },
        releaseDate: {
          type: String,
          default: '',
        },
        genres: {
          type: [String],
          default: [],
        },
        rating: {
          type: Number,
          default: 0,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Watchlist', watchlistSchema);
