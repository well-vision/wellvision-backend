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
    console.error('GET /profile error:', error.message); // Optional for debugging
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/*
|------------------------------------------------------------------------
| PUT /api/user/profile
|------------------------------------------------------------------------
| Protected route to update current user's profile fields.
| Allowed fields: name, phone, role, avatar
*/
router.put('/profile', userAuth, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'role', 'avatar'];
    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Object.assign(user, updates);
    await user.save();

    const safe = user.toObject();
    delete safe.password;
    delete safe.resetOtp;
    delete safe.verifyOtp;

    res.json({ success: true, user: safe });
  } catch (error) {
    console.error('PUT /profile error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
