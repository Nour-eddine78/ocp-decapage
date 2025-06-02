const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Auth = require('../models/Auth');
const User = require('../models/User');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Helper function to validate email format
const validateEmail = (email) => /.+\@.+\..+/.test(email);

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      data: {
        token,
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
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
    person.password = hashedPassword; // Sync password in User model

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

module.exports = {
  login,
  forgetPassword,
  resetPassword,
};