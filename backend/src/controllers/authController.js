const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const { Op } = require('sequelize');

const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Validate required fields
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: 'All fields are required',
        required: ['username', 'email', 'password', 'firstName', 'lastName']
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
    });

    // Generate JWT token
    const token = generateToken({ 
      userId: user.id, 
      username: user.username 
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      message: 'Internal server error during registration'
    });
  }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        message: 'Email/username and password are required'
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: login },
          { username: login }
        ]
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    // Generate JWT token
    const token = generateToken({ 
      userId: user.id, 
      username: user.username 
    });

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error during login'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        association: 'tasks',
        attributes: ['id', 'title', 'status', 'priority', 'createdAt']
      }]
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;
    const user = req.user;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (avatar !== undefined) updateData.avatar = avatar;

    await user.update(updateData);

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      });
    }

    const user = req.user;
    const isValidPassword = await user.comparePassword(currentPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      });
    }

    await user.update({ password: newPassword });

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};