const mongoose = require('mongoose');
const User = require('../models/User');
const Auth = require('../models/Auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { ObjectId } = mongoose.Types;

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Input validation helper
const validateEmail = (email) => /.+\@.+\..+/.test(email);

const validateRole = (role) => {
  const validRoles = ['superadmin', 'admin', 'manager', 'operator', 'viewer'];
  return validRoles.includes(role);
};

// Create a new User (including Superadmin role)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, address, team, siteId } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!validateRole(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword, // Store hashed password in User
      role,
      phoneNumber,
      address,
      team,
      site: siteId,
      active: true,
    });

    // Save user
    await user.save();

    // Create corresponding Auth record
    const auth = new Auth({
      email,
      password: hashedPassword, // Same hashed password in Auth
      id_person: user._id,
      id_person_model: 'User',
    });
    await auth.save();

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        team: user.team,
        site: user.site,
        active: user.active,
      },
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
};

// Update a User
const updateUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, password, role, phoneNumber, address, team, siteId, active } = req.body;

    if (name) user.name = name.trim();
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
      const auth = await Auth.findOne({ id_person: user._id });
      if (auth) {
        auth.email = email;
        await auth.save();
      }
    }
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      const auth = await Auth.findOne({ id_person: user._id });
      if (auth) {
        auth.password = hashedPassword;
        await auth.save();
      }
    }
    if (role) {
      if (!validateRole(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
      user.role = role;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address.trim();
    if (team) user.team = team.trim();
    if (siteId) user.siteId = site;
    if (typeof active === 'boolean') user.active = active;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
        team: updatedUser.team,
        site: updatedUser.site,
        active: updatedUser.active,
      },
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

// Get all Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.status(200).json({
      success: true,
      data: users,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Get a single User by ID
const getUserById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        team: user.team,
        site: user.site,
        active: user.active,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
      message: 'User retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

// Delete a User
const deleteUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await Auth.deleteOne({ id_person: user._id });
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};

// Login User (handles all roles, including superadmin)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const auth = await Auth.findOne({ email }).populate('id_person');
    if (!auth || !auth.id_person || auth.id_person_model !== 'User') {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Update lastLogin
    auth.id_person.lastLogin = new Date();
    await auth.id_person.save();

    const token = generateToken(auth.id_person);

    res.status(200).json({
      success: true,
      data: {
        token,
        role: auth.id_person.role,
        id: auth.id_person._id,
        name: auth.id_person.name,
        email: auth.id_person.email,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Forget Password
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  try {
    const auth = await Auth.findOne({ email }).populate('id_person');
    if (!auth || !auth.id_person || auth.id_person_model !== 'User') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    auth.id_person.resetPasswordToken = hashedResetToken;
    auth.id_person.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await auth.id_person.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested a password reset.\n\n
        Please click on the following link, or paste it into your browser to reset your password:\n\n
        http://${req.headers.host}/api/auth/reset-password/${resetToken}\n\n
        If you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('Error in forget password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const person = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!person) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const auth = await Auth.findOne({ id_person: person._id });
    if (!auth) {
      return res.status(400).json({ success: false, message: 'Auth record not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    auth.password = hashedPassword;
    person.password = hashedPassword; // Sync password in User

    person.resetPasswordToken = undefined;
    person.resetPasswordExpires = undefined;

    await auth.save();
    await person.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get Current User
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        team: user.team,
        site: user.site,
        active: user.active,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
      message: 'User retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update Current User
const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, phoneNumber, address, team, siteId } = req.body;

    if (name) user.name = name.trim();
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
      const auth = await Auth.findOne({ id_person: user._id });
      if (auth) {
        auth.email = email;
        await auth.save();
      }
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address.trim();
    if (team) user.team = team.trim();
    if (siteId) user.siteId = site;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        team: user.team,
        site: user.site,
        active: user.active,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error in updateMe:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const auth = await Auth.findOne({ id_person: user._id });
    if (!auth) {
      return res.status(400).json({ success: false, message: 'Auth record not found' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    const isMatch = await bcrypt.compare(currentPassword, auth.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    auth.password = hashedPassword;
    user.password = hashedPassword; // Sync password in User

    await auth.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get Users Count
const getUsersCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({
      success: true,
      data: { count },
      message: 'Users count retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching users count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users count',
      error: error.message,
    });
  }
};

// Get Recent User Activity
const getRecentActivity = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ lastLogin: -1 })
      .limit(5)
      .select('name email role lastLogin')
      .lean();

    res.status(200).json({
      success: true,
      data: users,
      message: 'Recent user activity retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: error.message,
    });
  }
};

// Get System Uptime (from superadminController.js)
const getSystemUptime = async (req, res) => {
  try {
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    res.status(200).json({
      success: true,
      data: {
        uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      },
      message: 'System uptime retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching uptime:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch uptime',
      error: error.message,
    });
  }
};

// Get System Monitoring Data (from superadminController.js)
const getSystemMonitoring = async (req, res) => {
  try {
    const recentIncidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('severityLevel status createdAt');
    const recentOperations = await Operation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('ficheId interventionDate createdAt');
    res.status(200).json({
      success: true,
      data: {
        recentIncidents,
        recentOperations,
      },
      message: 'Monitoring data retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monitoring data',
      error: error.message,
    });
  }
};

module.exports = {
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
};