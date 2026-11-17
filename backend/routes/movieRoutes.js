const express = require('express');
const router = express.Router();
const {
  getMovies,
  searchMovies,
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
  getMovieDetails,
  getGenres,
} = require('../controllers/movieController');

router.get('/', getMovies);
router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/top-rated', getTopRated);
router.get('/now-playing', getNowPlaying);
router.get('/genres', getGenres);
router.get('/search', searchMovies);
router.get('/:id', getMovieDetails);

module.exports = router;
