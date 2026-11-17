const Watchlist = require('../models/Watchlist');
const { getDBStatus } = require('../config/db');

// @desc    Get logged in user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  let watchlist = await Watchlist.findOne({ userId: req.user._id });

  if (!watchlist) {
    watchlist = await Watchlist.create({ userId: req.user._id, movies: [] });
  }

  res.json({
    success: true,
    count: watchlist.movies.length,
    movies: watchlist.movies,
  });
};

// @desc    Add movie to watchlist
// @route   POST /api/watchlist/:movieId
// @access  Private
const addToWatchlist = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const movieId = Number(req.params.movieId);
  const { title, posterPath, backdropPath, releaseDate, genres, rating } = req.body;

  let watchlist = await Watchlist.findOne({ userId: req.user._id });

  if (!watchlist) {
    watchlist = new Watchlist({ userId: req.user._id, movies: [] });
  }

  const alreadySaved = watchlist.movies.some((m) => m.tmdbId === movieId);
  if (alreadySaved) {
    return res.status(400).json({
      success: false,
      message: 'Movie is already in your watchlist.',
    });
  }

  watchlist.movies.unshift({
    tmdbId: movieId,
    title: title || 'Untitled Movie',
    posterPath: posterPath || '',
    backdropPath: backdropPath || '',
    releaseDate: releaseDate || '',
    genres: Array.isArray(genres) ? genres : [],
    rating: Number(rating) || 0,
    addedAt: new Date(),
  });

  await watchlist.save();

  res.status(201).json({
    success: true,
    message: 'Movie added to your watchlist!',
    movies: watchlist.movies,
  });
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({ success: false, message: 'Database not connected.' });
  }

  const movieId = Number(req.params.movieId);
  const watchlist = await Watchlist.findOne({ userId: req.user._id });

  if (!watchlist) {
    return res.status(404).json({
      success: false,
      message: 'Watchlist not found.',
    });
  }

  watchlist.movies = watchlist.movies.filter((m) => m.tmdbId !== movieId);
  await watchlist.save();

  res.json({
    success: true,
    message: 'Movie removed from your watchlist.',
    movies: watchlist.movies,
  });
};

// @desc    Check if movie is in watchlist
// @route   GET /api/watchlist/check/:movieId
// @access  Private
const checkInWatchlist = async (req, res) => {
  if (!getDBStatus()) {
    return res.json({ success: true, inWatchlist: false });
  }

  const movieId = Number(req.params.movieId);
  const watchlist = await Watchlist.findOne({ userId: req.user._id });

  const inWatchlist = watchlist
    ? watchlist.movies.some((m) => m.tmdbId === movieId)
    : false;

  res.json({
    success: true,
    inWatchlist,
  });
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkInWatchlist,
};
