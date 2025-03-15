import { useEffect, useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { setupForegroundMessageHandler } from './services/fcm-service'; // Import the FCM service

import Layout from './components/layout.jsx';
import Home from './components/landingPage/landingHome.jsx';
import AboutUs from './components/landingPage/landingAbout.jsx';
import Contacts from './components/landingPage/landingContact.jsx';
import LoginPage from "./components/loginSignup/loginPage.jsx";
import Signup from './components/loginSignup/signup.jsx';
import ListingHome from './components/listingPage/listingHome.jsx';
import JobDetails from './components/listingPage/jobDetails.jsx';

// screens & layouts
import WorkerLayout from './layouts/WorkerLayout.jsx';

import { generateToken } from './notifications/firebase.js';
import { onMessage } from 'firebase/messaging';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Set up FCM foreground message handler
    setupForegroundMessageHandler();

    // Firebase messaging setup
    generateToken();
    onMessage((payload) => {
      console.log('Received foreground notification:', payload);
    });
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "aboutus", element: <AboutUs /> },
        { path: "contacts", element: <Contacts /> },
      ],
    },
    { path: "login", element: <LoginPage /> },
    { path: "signup", element: <Signup /> },
    { 
      path: "worker-home", 
      element: <WorkerLayout />, 
      children: [
        { index: true, element: <ListingHome /> },
      ],
    },
    { path: "jobdetails", element: <JobDetails /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
