import React, { useState, useEffect } from 'react';
import { AuthKitProvider, SignInButton, useProfile } from '@farcaster/auth-kit';
import { ethers } from 'ethers'; // Import ethers.js for blockchain interaction
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

const NFT_COLLECTION_ADDRESS = '0x405aa83aE09f1a9C4000696F666D5A1B510F6BAe'; // Collection address

const UserProfile = () => {
  const { isAuthenticated, profile } = useProfile();
  const [nfts, setNfts] = useState([]); // State to store NFTs
  const [isFetching, setIsFetching] = useState(false); // Track if fetching is in progress

  useEffect(() => {
    if (isAuthenticated && profile?.wallet) {
      setIsFetching(true);
      fetchNFTs(profile.wallet);
    }
  }, [isAuthenticated, profile?.wallet]);

  const fetchNFTs = async (walletAddress) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
      const contract = new ethers.Contract(
        NFT_COLLECTION_ADDRESS,
        [
          'function balanceOf(address owner) view returns (uint256)',
          'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
          'function tokenURI(uint256 tokenId) view returns (string)',
        ],
        provider
      );

      const balance = await contract.balanceOf(walletAddress);
      const nftPromises = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
        const tokenUri = await contract.tokenURI(tokenId);
        const metadata = await fetch(tokenUri).then((res) => res.json());
        nftPromises.push({ tokenId, metadata });
      }

      const nftData = await Promise.all(nftPromises);
      setNfts(nftData);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setIsFetching(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="top-right-button">
          <SignInButton /> {/* Standard sign-in button */}
        </div>
        <div className="welcome-text">
          <h1>Welcome to Anoncraft</h1>
          <p>Sign in to play</p>
        </div>
      </>
    );
  }

  if (isFetching) {
    return (
      <div className="loading-message">
        <h2>Loading...</h2>
        <p>Fetching your NFTs, please wait.</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="no-nfts-message">
        <h2>Sorry, no Anon Colors held.</h2>
        <p>To access Anoncraft, you must hold at least one Anon Color NFT.</p>
        <p>
          You can purchase one on the secondary market at{' '}
          <a href="https://opensea.io/es/collection/anoncolors" target="_blank" rel="noopener noreferrer">
            OpenSea
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="post-login-welcome">
        <h2>Welcome, {profile?.username || 'User'}!</h2>
        <p>Your Anon Colors collection:</p>
      </div>
      <div className="nft-gallery">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="nft-card">
            <img src={nft.metadata.image} alt={`NFT ${nft.tokenId}`} />
            <p>{nft.metadata.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopRightButton = () => {
  const { isAuthenticated, profile } = useProfile();

  return (
    <div className="top-right-button">
      {!isAuthenticated ? (
        <SignInButton />
      ) : (
        <div className="profile-button">
          <img
            src={profile?.pfpUrl || 'https://via.placeholder.com/40'}
            alt="Profile"
            className="profile-pic"
          />
          <span className="profile-name">{profile?.username || 'User'}</span>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <AuthKitProvider config={config}>
    <div>
      <TopRightButton />
      <UserProfile />
    </div>
  </AuthKitProvider>
);

export default App;
