import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    const [currentAccount, setCurrentAccount] = useState('')

    const connectWallet = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) {
          alert("Get MetaMask -> https://metamask.io/");
          return;
        }

        // Method to request access to account
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

        // This should print out public address once we authorize Metamask
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      } catch (error) {
        console.log(error)
      }
    }

  	const checkIfWalletIsConnected = async () => {
  		const { ethereum } = window;

  		// Make sure we have access to window.ethereum (injected by Metamask)
  		if (!ethereum) {
  			console.log("Make sure you have MetaMask!");
  			return;
  		} else {
  			console.log("We have the ethereum object", ethereum);
  		}

  		// Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      // Users can have multiple authorized accounts, we grab the first one if its there
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
  	}

  	const renderNotConnectedContainer = () => (
  		<div className="connect-wallet-container">
  			<img src="https://media.giphy.com/media/3o6Mbi33H758V6pJyo/giphy.gif" alt="Dog planet gif" />
  			<button
  			  className="cta-button connect-wallet-button"
          onClick={connectWallet}
        >
  				Connect Wallet
  			</button>
  		</div>
    	);

    const renderConnectedWalletContainer = () => (
      <div className="connect-wallet-container">
        <img src="https://media.giphy.com/media/ciwgweZDnUydJShj6H/giphy.gif" alt="Happy astronaut" />
        Wallet {currentAccount} is connected 👍
      </div>
    );

  	useEffect(() => {
  		checkIfWalletIsConnected();
  	}, [])

  return (
		<div className="App">
			<div className="container">

				<div className="header-container">
					<header>
            <div className="left">
              <p className="title">🪐💫 Andromeda Galaxy Planet Naming Service</p>
              <p className="subtitle">The immortal naming service API for the Andromeda galaxy on the blockchain!</p>
            </div>
					</header>
				</div>

				{!currentAccount && renderNotConnectedContainer()}
				{currentAccount && renderConnectedWalletContainer()}

        <div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built with @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
}

export default App;
