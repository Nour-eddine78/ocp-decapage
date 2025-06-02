const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    const user = await User.findById(decoded.id).select('_id name email role');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Token expired or invalid' });
  }
};

const restrictTo = (...roles) => async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, no user' });
    }

    const userRole = req.user.role?.toLowerCase();
    const allowedRoles = roles.map(role => role.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Requiert le rôle : ${allowedRoles.join(', ')}`
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { protect, restrictTo };