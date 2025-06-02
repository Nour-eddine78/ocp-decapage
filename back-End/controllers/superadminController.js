const mongoose = require('mongoose');
const Superadmin = require('../models/Superadmin');
const Auth = require('../models/Auth');
const Incident = require('../models/Incident');
const Operation = require('../models/Operation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { ObjectId } = mongoose.Types;

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Create a new Superadmin
const createSuperadmin = async (req, res) => {
  try {
    const { name, email, phoneNumber, address, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (!/.+\@.+\..+/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const existingSuperadmin = await Superadmin.findOne({ email });
    if (existingSuperadmin) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const superadmin = new Superadmin({
      name,
      email,
      phoneNumber,
      address,
      role: 'Superadmin'
    });

    const savedSuperadmin = await superadmin.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const auth = new Auth({
      email,
      password: hashedPassword,
      id_person: savedSuperadmin._id,
      id_person_model: 'Superadmin'
    });

    await auth.save();

    res.status(201).json({
      success: true,
      data: {
        id: savedSuperadmin._id,
        name: savedSuperadmin.name,
        email: savedSuperadmin.email,
        phoneNumber: savedSuperadmin.phoneNumber,
        address: savedSuperadmin.address,
        role: savedSuperadmin.role
      },
      message: 'Superadmin created successfully'
    });
  } catch (error) {
    console.error('Error creating superadmin:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create superadmin',
      error: error.message
    });
  }
};

// Update a Superadmin
const updateSuperadmin = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid superadmin ID' });
    }

    const superadmin = await Superadmin.findById(req.params.id);
    if (!superadmin) {
      return res.status(404).json({ success: false, message: 'Superadmin not found' });
    }

    const { name, email, phoneNumber, address } = req.body;

    if (name) superadmin.name = name;
    if (email) {
      if (!/.+\@.+\..+/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
      superadmin.email = email;
      const auth = await Auth.findOne({ id_person: superadmin._id });
      if (auth) {
        auth.email = email;
        await auth.save();
      }
    }
    if (phoneNumber) superadmin.phoneNumber = phoneNumber;
    if (address) superadmin.address = address;

    const updatedSuperadmin = await superadmin.save();

    res.status(200).json({
      success: true,
      data: {
        id: updatedSuperadmin._id,
        name: updatedSuperadmin.name,
        email: updatedSuperadmin.email,
        phoneNumber: updatedSuperadmin.phoneNumber,
        address: updatedSuperadmin.address,
        role: updatedSuperadmin.role
      },
      message: 'Superadmin updated successfully'
    });
  } catch (error) {
    console.error('Error updating superadmin:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update superadmin',
      error: error.message
    });
  }
};

// Get all Superadmins
const getAllSuperadmins = async (req, res) => {
  try {
    const superadmins = await Superadmin.find().select('-resetPasswordToken -resetPasswordExpires');
    res.status(200).json({
      success: true,
      data: superadmins
    });
  } catch (error) {
    console.error('Error fetching superadmins:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch superadmins',
      error: error.message
    });
  }
};

// Get a single Superadmin by ID
const getSuperadminById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid superadmin ID' });
    }
    const superadmin = await Superadmin.findById(req.params.id).select('-resetPasswordToken -resetPasswordExpires');
    if (!superadmin) {
      return res.status(404).json({ success: false, message: 'Superadmin not found' });
    }
    res.status(200).json({
      success: true,
      data: {
        id: superadmin._id,
        name: superadmin.name,
        email: superadmin.email,
        phoneNumber: superadmin.phoneNumber,
        address: superadmin.address,
        role: superadmin.role
      }
    });
  } catch (error) {
    console.error('Error fetching superadmin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch superadmin',
      error: error.message
    });
  }
};

// Delete a Superadmin
const deleteSuperadmin = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid superadmin ID' });
    }
    const superadmin = await Superadmin.findById(req.params.id);
    if (!superadmin) {
      return res.status(404).json({ success: false, message: 'Superadmin not found' });
    }
    await Auth.deleteOne({ id_person: superadmin._id });
    await superadmin.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Superadmin deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting superadmin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete superadmin',
      error: error.message
    });
  }
};

// Login Superadmin
const loginSuperadmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const auth = await Auth.findOne({ email }).populate('id_person');
    if (!auth || !auth.id_person || !(auth.id_person instanceof Superadmin)) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(auth.id_person);

    res.json({
      success: true,
      data: {
        token,
        role: 'Superadmin'
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Forget Password
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const auth = await Auth.findOne({ email }).populate('id_person');
    if (!auth || !auth.id_person || !(auth.id_person instanceof Superadmin)) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    auth.id_person.resetPasswordToken = hashedResetToken;
    auth.id_person.resetPasswordExpires = Date.now() + 3600000;
    await auth.id_person.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Réinitialisation du mot de passe',
      text: `Vous recevez ceci car vous (ou quelqu'un d'autre) avez demandé une réinitialisation de mot de passe.\n\n
        Cliquez sur le lien suivant ou collez-le dans votre navigateur pour réinitialiser votre mot de passe :\n\n
        http://${req.headers.host}/api/auth/reset-password/${resetToken}\n\n
        Si vous n'avez pas demandé cela, veuillez ignorer cet e-mail.\n`
    };

    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: 'E-mail de réinitialisation de mot de passe envoyé'
    });
  } catch (error) {
    console.error('Erreur lors de l\'oubli de mot de passe :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const person = await Superadmin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!person) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const auth = await Auth.findOne({ id_person: person._id });
    if (!auth) {
      return res.status(400).json({ success: false, message: 'Auth record not found' });
    }

    const salt = await bcrypt.genSalt(10);
    auth.password = await bcrypt.hash(password, salt);

    person.resetPasswordToken = undefined;
    person.resetPasswordExpires = undefined;

    await auth.save();
    await person.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get Current Superadmin
const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const person = await Superadmin.findById(decoded.id).select('-resetPasswordToken -resetPasswordExpires');

    if (!person) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: person._id,
        name: person.name,
        email: person.email,
        phoneNumber: person.phoneNumber,
        address: person.address,
        role: 'Superadmin'
      }
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update Current Superadmin
const updateMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const person = await Superadmin.findById(decoded.id);
    if (!person) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, email, phoneNumber, address } = req.body;

    person.name = name || person.name;
    person.email = email || person.email;
    person.phoneNumber = phoneNumber || person.phoneNumber;
    person.address = address || person.address;

    if (email && email !== person.email) {
      const auth = await Auth.findOne({ id_person: person._id });
      if (auth) {
        auth.email = email;
        await auth.save();
      }
    }

    await person.save();

    res.json({
      success: true,
      data: {
        id: person._id,
        name: person.name,
        email: person.email,
        phoneNumber: person.phoneNumber,
        address: person.address,
        role: 'Superadmin'
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error in updateMe:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const person = await Superadmin.findById(decoded.id);
    if (!person) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const auth = await Auth.findOne({ id_person: person._id });
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
    auth.password = await bcrypt.hash(newPassword, salt);

    await auth.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get System Uptime
const getSystemUptime = async (req, res) => {
  try {
    // Mock uptime data (replace with actual system uptime logic if available)
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    res.status(200).json({
      success: true,
      data: {
        uptime: `${uptimeHours}h ${uptimeMinutes}m`
      },
      message: 'System uptime retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching uptime:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch uptime',
      error: error.message
    });
  }
};

// Get System Monitoring Data
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
        recentOperations
      },
      message: 'Monitoring data retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monitoring data',
      error: error.message
    });
  }
};

module.exports = {
  createSuperadmin,
  updateSuperadmin,
  getAllSuperadmins,
  getSuperadminById,
  deleteSuperadmin,
  loginSuperadmin,
  forgetPassword,
  resetPassword,
  getMe,
  updateMe,
  updateMe,
  changePassword,
  getSystemUptime,
  getSystemMonitoring
};
