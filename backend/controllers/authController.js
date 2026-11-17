const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { getDBStatus } = require('../config/db');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({
      success: false,
      message: 'Database is connecting or not yet connected. Please configure your MONGODB_URI in backend/.env.',
    });
  }

  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide full name, email and password.',
    });
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match.',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  const userExists = await User.findOne({ email: email.toLowerCase().trim() });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'A user with this email address already exists.',
    });
  }

  // Strictly enforce default role to 'user' so users cannot make themselves admins
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: 'user',
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to CineReview.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user registration data.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  if (!getDBStatus()) {
    return res.status(503).json({
      success: false,
      message: 'Database is connecting or not yet connected. Please configure your MONGODB_URI in backend/.env.',
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    });
  }

  // Include password since schema has select: false
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify your credentials.',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
