// userRoutes.js
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import userModel from '../models/userModel.js';

const router = express.Router();

// Protected Route: Get User Profile
router.get('/profile', userAuth, async (req, res) => {
  try {
    // Fetch user by ID saved in req.user by userAuth middleware
    const user = await userModel.findById(req.user.id).select('-password -resetOtp -verifyOtp');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
