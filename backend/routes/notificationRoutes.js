import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../controllers/notificationController.js";
import { sendJobStatusNotification } from "../services/notification-service.js";

const router = express.Router();

// ✅ Get all notifications for the logged-in user
router.get("/", authMiddleware, getNotifications);

// ✅ Mark all notifications as read
router.put("/mark-read", authMiddleware, markNotificationsAsRead);

// ✅ Test endpoint for sending notifications
router.post("/test-send", async (req, res) => {
  try {
    const { candidateId, jobId, status, jobTitle } = req.body;
    
    // Validate required fields
    if (!candidateId || !jobId || !status || !jobTitle) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: candidateId, jobId, status, and jobTitle are required" 
      });
    }
    
    // Send the notification
    const success = await sendJobStatusNotification(
      candidateId,
      jobId,
      status,
      jobTitle
    );
    
    if (success) {
      return res.status(200).json({
        success: true,
        message: "Notification sent successfully"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to send notification, check server logs for details"
      });
    }
  } catch (error) {
    console.error("Error in test notification endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Server error when sending notification",
      error: error.message
    });
  }
});

export default router;