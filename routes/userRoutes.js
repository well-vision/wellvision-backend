// userRoutes.js
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import userModel from '../models/userModel.js';

const router = express.Router();

// Protected Route: Get User Profile
router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id) // ✅ Corrected this line
      .select('-password -resetOtp -verifyOtp');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('GET /profile error:', error.message); // optional: log for debugging
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
