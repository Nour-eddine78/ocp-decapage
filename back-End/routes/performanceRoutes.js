const express = require('express');
const router = express.Router();
const {
  createPerformance,
  updatePerformance,
  getAllPerformances,
  getPerformanceById,
  deletePerformance,
  getPerformanceScore
} = require('../controllers/performanceController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);
router.route('/')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getAllPerformances)
  .post(restrictTo('superadmin', 'admin', 'manager'), createPerformance);
router.route('/score')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getPerformanceScore);
router.route('/:id')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getPerformanceById)
  .put(restrictTo('superadmin', 'admin', 'manager'), updatePerformance)
  .delete(restrictTo('superadmin', 'admin', 'manager'), deletePerformance);

module.exports = router;