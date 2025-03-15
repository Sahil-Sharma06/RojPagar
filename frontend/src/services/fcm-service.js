// fcm-service.js
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import firebaseApp from "./firebase-config";

const messaging = getMessaging(firebaseApp);
const VAPID_KEY = "key"; // The key you generated in Step 4

// Function to request notification permission
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");
      return true;
    } else {
      console.warn("⚠️ Notification permission denied.");
      return false;
    }
  } catch (error) {
    console.error("❌ Error requesting notification permission:", error);
    return false;
  }
};

// Function to get FCM token
export const getFCMToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      console.log("🚀 FCM Token Retrieved Successfully:");
      console.log(`🔑 FCM Token: ${currentToken}`);
      return currentToken;
    } else {
      console.warn("⚠️ No FCM token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error retrieving FCM token:", error);
    return null;
  }
};

// Function to send token to your backend
export const sendTokenToServer = async (token, userId) => {
  if (!token) {
    console.error("❌ No FCM token available. Cannot send to server.");
    return;
  }

  try {
    console.log(`📡 Sending FCM Token to Server for User: ${userId}`);
    
    const response = await fetch('http://localhost:5173/api/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-auth-token' // If you use authentication
      },
      body: JSON.stringify({
        userId: userId,
        fcmToken: token,
        platform: 'web',
        timestamp: new Date().toISOString()
      })
    });

    const data = await response.json();
    console.log("✅ Server Response:", data);
    return data;
  } catch (error) {
    console.error("❌ Error sending token to server:", error);
    return null;
  }
};

// Function to handle foreground messages
export const setupForegroundMessageHandler = () => {
  onMessage(messaging, (payload) => {
    console.log("📩 Received Foreground Message:", payload);

    // Displaying a notification
    if (payload.notification) {
      console.log("🔔 Notification Details:");
      console.log(`Title: ${payload.notification.title}`);
      console.log(`Body: ${payload.notification.body}`);

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "/logo192.png"
      };

      new Notification(notificationTitle, notificationOptions);
    }
  });
};

// Call this function to request permission & get token
export const initializeFCM = async (userId) => {
  const permissionGranted = await requestNotificationPermission();
  if (permissionGranted) {
    const token = await getFCMToken();
    if (token) {
      await sendTokenToServer(token, userId);
    }
  }
};
