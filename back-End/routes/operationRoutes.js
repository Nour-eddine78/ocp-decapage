const express = require('express');
const router = express.Router();
const {
  createOperation,
  updateOperation,
  getAllOperations,
  getOperationById,
  deleteOperation,
  getOperationsCount
} = require('../controllers/operationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);
router.route('/')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getAllOperations)
  .post(restrictTo('superadmin', 'admin', 'manager', 'operator'), createOperation);
router.route('/count')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getOperationsCount);
router.route('/:id')
  .get(restrictTo('superadmin', 'admin', 'manager', 'operator', 'viewer'), getOperationById)
  .put(restrictTo('superadmin', 'admin', 'manager', 'operator'), updateOperation)
  .delete(restrictTo('superadmin', 'admin', 'manager'), deleteOperation);

module.exports = router;