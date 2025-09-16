const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

// Get user profile (same as auth profile, but available here for consistency)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;