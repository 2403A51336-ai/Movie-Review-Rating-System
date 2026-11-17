const express = require('express');
const router = express.Router();
const {
  createReview,
  getMovieReviews,
  updateReview,
  deleteReview,
  toggleHelpful,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createReview);

router.route('/:movieId')
  .get(getMovieReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/:id/helpful')
  .post(protect, toggleHelpful);

module.exports = router;
