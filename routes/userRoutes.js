// routes/userRoutes.js
import express from 'express';
import userAuth from '../middleware/userAuth.js';
import userModel from '../models/userModel.js';

const router = express.Router();

/*
|------------------------------------------------------------------------
| GET /api/user/profile
|------------------------------------------------------------------------
| Protected route to get current user's profile.
| Requires JWT in cookie; user info set in req.user by middleware.
*/
router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select(
      '-password -resetOtp -verifyOtp'
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
