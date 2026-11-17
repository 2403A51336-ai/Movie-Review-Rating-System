const express = require('express');
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkInWatchlist,
} = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getWatchlist);

router.route('/check/:movieId')
  .get(checkInWatchlist);

router.route('/:movieId')
  .post(addToWatchlist)
  .delete(removeFromWatchlist);

module.exports = router;
