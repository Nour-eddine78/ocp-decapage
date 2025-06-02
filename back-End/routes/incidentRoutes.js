const express = require('express');
const router = express.Router();
const {
  createIncident,
  updateIncident,
  getAllIncidents,
  getIncidentById,
  deleteIncident,
  getIncidentsCount,
  getRecentIncidents
} = require('../controllers/incidentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protected routes
router.use(protect);
router.route('/')
  .get(restrictTo('superadmin', 'viewer'), getAllIncidents)
  .post(restrictTo('superadmin'), createIncident);
router.route('/count')
  .get(restrictTo('superadmin', 'viewer'), getIncidentsCount);
router.route('/recent')
  .get(restrictTo('superadmin', 'viewer'), getRecentIncidents);
router.route('/:id')
  .get(restrictTo('superadmin', 'viewer'), getIncidentById)
  .put(restrictTo('superadmin'), updateIncident)
  .delete(restrictTo('superadmin', 'manager'), deleteIncident);

module.exports = router;