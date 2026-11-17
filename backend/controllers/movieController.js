const tmdb = require('../config/tmdb');
const Review = require('../models/Review');
const { getDBStatus } = require('../config/db');

// Helper to attach CineReview community rating & review count from MongoDB
const attachCommunityStats = async (movieId) => {
  if (!getDBStatus()) {
    return { cineReviewRating: 0, totalReviews: 0 };
  }

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
      return {
        cineReviewRating: Number(stats[0].averageRating.toFixed(1)),
        totalReviews: stats[0].totalReviews,
      };
    }
  } catch (err) {
    console.error('Error calculating community stats:', err.message);
  }

  return { cineReviewRating: 0, totalReviews: 0 };
};

// @desc    Get all movies with filtering and sorting
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const { genre, sortBy, page = 1 } = req.query;
    const data = await tmdb.discoverMovies({
      genreId: genre,
      sortBy: sortBy || 'popularity.desc',
      page: Number(page),
    });

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movies: ' + error.message,
    });
  }
};

// @desc    Search movies by query
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const data = await tmdb.searchMovies(query, Number(page));

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search movies: ' + error.message,
    });
  }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrending = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const data = await tmdb.getTrending(page);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopular = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const data = await tmdb.getPopular(page);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
const getTopRated = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const data = await tmdb.getTopRated(page);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get now playing / recently released movies
// @route   GET /api/movies/now-playing
// @access  Public
const getNowPlaying = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const data = await tmdb.getNowPlaying(page);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get movie details by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await tmdb.getMovieDetails(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: `Movie with ID ${id} not found.`,
      });
    }

    const communityStats = await attachCommunityStats(id);

    res.json({
      success: true,
      movie: {
        ...movie,
        ...communityStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve movie details: ' + error.message,
    });
  }
};

// @desc    Get genres list
// @route   GET /api/movies/genres
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = await tmdb.getGenresList();
    res.json({
      success: true,
      genres,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMovies,
  searchMovies,
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getMovieDetails,
  getGenres,
};
