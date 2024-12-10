import React from 'react';
import { AuthKitProvider, SignInButton, useProfile } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css'; // Correctly importing styles

// Import and initialize Buffer for browser compatibility
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'example.com',
  siweUri: 'https://example.com/login',
};

const UserProfile = () => {
  const { isAuthenticated, profile } = useProfile();

  if (!isAuthenticated) {
    return <p>You're not signed in.</p>;
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Farcaster Login</h1>
      <SignInButton />
      <UserProfile />
    </div>
  </AuthKitProvider>
);

export default App;


