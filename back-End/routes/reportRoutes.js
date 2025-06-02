
const express = require('express');
const router = express.Router();
const {
  createReport,
  updateReport,
  getAllReports,
  getReportById,
  deleteReport,
  getReportsCount,
  uploadReportFile,
  serveReportFile,
} = require('../controllers/reportController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);

// Report CRUD routes
router.route('/')
  .get(restrictTo('superadmin', 'viewer'), getAllReports)
  .post(restrictTo('superadmin'), createReport);
  // File handling routes
router.route('/upload')
  .post(restrictTo('superadmin'), uploadReportFile);

router.route('/count')
  .get(restrictTo('superadmin'), getReportsCount);

router.route('/:id')
  .get(restrictTo('superadmin', 'viewer'), getReportById)
  .put(restrictTo('superadmin'), updateReport)
  .delete(restrictTo('superadmin'), deleteReport);



router.route('/files/:filename')
  .get(restrictTo('superadmin', 'viewer'), serveReportFile);

module.exports = router;