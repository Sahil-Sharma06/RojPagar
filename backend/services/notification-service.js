import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../models/User.js";

// Fix for JSON Import Issue in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(
  __dirname,
  "../config/rojpagar-firebase-adminsdk-fbsvc-682d5e2f9b.json"
);

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Function to Send Job Status Notification
export async function sendJobStatusNotification(
  candidateId,
  jobId,
  status,
  jobTitle
) {
  try {
    // Get candidate's FCM token from the database
    const candidate = await User.findById(candidateId);

    if (!candidate || !candidate.fcmToken) {
      console.log(`⚠️ No FCM token found for candidate ${candidateId}`);
      return false;
    }

    // Prepare notification message
    const message = {
      token: candidate.fcmToken,
      notification: {
        title: "📢 Job Application Update",
        body: `Your application for ${jobTitle} has been ${status}`,
      },
      data: {
        jobId: jobId.toString(),
        status: status,
        timestamp: new Date().toISOString(),
      },
      webpush: {
        fcmOptions: {
          link: `https://your-app.com/jobs/${jobId}`,
        },
      },
    };

    // Send the message
    const response = await admin.messaging().send(message);
    console.log("✅ Successfully sent notification:", response);
    return true;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    return false;
  }
}