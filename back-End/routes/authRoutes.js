const express = require('express');
const router = express.Router();
const {
  login,
  forgetPassword,
  resetPassword,

} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);



module.exports = router;