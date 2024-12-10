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
    return <p></p>;
  }

  return (
    <div>
      <p>Welcome, {profile.username}!</p>
      <img src={profile.pfpUrl} alt={`${profile.username}'s profile`} />
    </div>
  );
};

const App = () => (
  <AuthKitProvider config={config}>
    <div>
      {/* Login button positioned in the top-right corner */}
      <div className="top-right-button">
        <SignInButton />
      </div>

      {/* Text overlay */}
      <div className="text-overlay">
        <h1>Welcome to Anoncraft</h1>
        <p>Sign in to play</p>
      </div>

      {/* Centered user profile */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
        <UserProfile />
      </div>
    </div>
  </AuthKitProvider>
);

export default App;
