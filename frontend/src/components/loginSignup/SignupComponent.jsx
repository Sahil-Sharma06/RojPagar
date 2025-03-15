// SignupComponent.js
import React, { useState } from 'react';
import { requestNotificationPermission, getFCMToken, sendTokenToServer } from './fcm-service';

function SignupComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      // Your existing signup logic
      const user = await signupUser(email, password);
      
      // After successful signup, request notification permission
      const permissionGranted = await requestNotificationPermission();
      
      if (permissionGranted) {
        // Get FCM token
        const fcmToken = await getFCMToken();
        
        if (fcmToken) {
          // Send token to your backend
          await sendTokenToServer(fcmToken, user.id);
        }
      }
      
      // Continue with your app flow
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };
  
  return (
    <form onSubmit={handleSignup}>
      {/* Your form fields */}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignupComponent;
