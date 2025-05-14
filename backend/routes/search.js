const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Save search history
router.post('/', authMiddleware, async (req, res) => {
  const { address, latitude, longitude } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.searchHistory.push({ address, latitude, longitude });
    await user.save();
    res.status(200).json({ message: 'Search history saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get search history (sorted by timestamp, most recent first)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Sort by timestamp in descending order (most recent first)
    const sortedHistory = user.searchHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.status(200).json(sortedHistory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a specific history item by index
router.delete('/:index', authMiddleware, async (req, res) => {
  const { index } = req.params;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (index < 0 || index >= user.searchHistory.length) {
      return res.status(400).json({ message: 'Invalid history index' });
    }
    user.searchHistory.splice(index, 1);
    await user.save();
    const sortedHistory = user.searchHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.status(200).json(sortedHistory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;