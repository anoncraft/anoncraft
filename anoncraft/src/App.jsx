import React from 'react';
import { AuthKitProvider, SignInButton, useProfile } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css'; // Import Farcaster Auth Kit styles

// Import and initialize Buffer for browser compatibility
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// Import custom styles for the login button and background
import './App.css';

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'example.com',
  siweUri: 'https://example.com/login',
};

const UserProfile = () => {
  const { isAuthenticated, profile } = useProfile();

  if (!isAuthenticated) {
    // Show the welcome text when not signed in
    return (
      <div className="welcome-text">
        <h1>Welcome to Anoncraft</h1>
        <p>Sign in to play</p>
      </div>
    );
  }

  // Show nothing in the center after signing in
  return null;
};

const App = () => (
  <AuthKitProvider config={config}>
    <div>
      {/* Login button positioned in the top-right corner */}
      <div className="top-right-button">
        <SignInButton />
      </div>

      {/* Centered user profile and welcome text */}
      <UserProfile />
    </div>
  </AuthKitProvider>
);

export default App;
