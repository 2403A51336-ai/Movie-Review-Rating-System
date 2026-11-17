const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllReviews,
  deleteAdminReview,
  getAllUsers,
  deleteUser,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteAdminReview);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
