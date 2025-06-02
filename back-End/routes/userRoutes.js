// routes/user.js
const express = require('express');
const router = express.Router();
const {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  loginUser,
  forgetPassword,
  resetPassword,
  getMe,
  updateMe,
  changePassword,
  getUsersCount,
  getRecentActivity,
  getSystemUptime,
  getSystemMonitoring,
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
router.get('/me', protect, getMe);
router.post('/', protect, restrictTo('superadmin', 'admin'), createUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgetPassword);

router.put('/reset-password/:token', resetPassword);

router.put('/me', protect, updateMe);
router.put('/change-password', protect, changePassword);
router.get('/', protect, getAllUsers);
router.get('/count', protect, getUsersCount);
router.get('/recent-activity', protect, getRecentActivity);
router.get('/system/uptime', protect, restrictTo('superadmin'), getSystemUptime);
router.get('/system/monitoring', protect, restrictTo('superadmin'), getSystemMonitoring);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, restrictTo('superadmin', 'admin'), updateUser);
router.delete('/:id', protect, restrictTo('superadmin'), deleteUser);

module.exports = router;