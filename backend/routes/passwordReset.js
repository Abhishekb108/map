const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Request password reset (send reset link)
router.post('/request', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Log the saved user to verify
    console.log(`User after saving reset token:`, await User.findOne({ email }));

    // Simulate sending email by logging the reset link (in a real app, you'd send an email)
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    console.log(`Password reset link for ${email}: ${resetLink}`);

    res.status(200).json({ message: 'Password reset link has been sent to your email (check console for link).' });
  } catch (err) {
    console.error('Error in password reset request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password using token
router.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    console.log(`User found for token ${token}:`, user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password; // Password will be hashed in the User model pre-save hook
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Error in password reset:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;