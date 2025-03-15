import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

router.post('/fcm-token', async (req, res) => {
  try {
    const { userId, fcmToken, platform, timestamp } = req.body;
    
    // Update or create token in database
    await User.findByIdAndUpdate(userId, {
      fcmToken: fcmToken,
      tokenPlatform: platform,
      tokenUpdatedAt: timestamp
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;