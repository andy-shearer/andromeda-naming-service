import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import polygonLogo from "./assets/polygonlogo.png"
import ethLogo from "./assets/ethlogo.png"
import {ethers} from "ethers";
import contractAbi from "./assets/domainsABI.json"
import { networks } from './utils/networks';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const tld = '.andromeda';
const CONTRACT_ADDRESS = '0x17F6488f6f5Ea4e42f9ACcDF1C976E7f63Ad833d';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState('')
    const [domain, setDomain] = useState('');
    const [colour, setColour] = useState('');
  	const [network, setNetwork] = useState('');

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

    const switchNetwork = async () => {
    	if (window.ethereum) {
    		try {
    			// Try to switch to the Mumbai testnet
    			await window.ethereum.request({
    				method: 'wallet_switchEthereumChain',
    				params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
    			});
    		} catch (error) {
    			// This error code means that the chain we want has not been added to MetaMask
    			// In this case we ask the user to add it to their MetaMask
    			if (error.code === 4902) {
    				try {
    					await window.ethereum.request({
    						method: 'wallet_addEthereumChain',
    						params: [
    							{
    								chainId: '0x13881',
    								chainName: 'Polygon Mumbai Testnet',
    								rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    								nativeCurrency: {
    										name: "Mumbai Matic",
    										symbol: "MATIC",
    										decimals: 18
    								},
    								blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
    							},
    						],
    					});
    				} catch (error) {
    					console.log(error);
    				}
    			}
    			console.log(error);
    		}
    	} else {
    		// If window.ethereum is not found then MetaMask is not installed
    		alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
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

      // Check the user's network chain ID
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      setNetwork(networks[chainId]);

      ethereum.on('chainChanged', handleChainChanged);

      // Reload the page when a user changes networks
      function handleChainChanged(_chainId) {
        window.location.reload();
      }

  	}

  	const mintDomain = async () => {
    	// Don't run if the domain is empty
    	if (!domain) { return }
    	// Alert the user if the domain is too short
    	if (domain.length < 3) {
    		alert('Domain must be at least 3 characters long');
    		return;
    	}
    	// Calculate price based on length of domain (change this to match your contract)
    	// 3 chars = 0.05 MATIC, 4 chars = 0.03 MATIC, 5 or more = 0.01 MATIC
    	const price = domain.length === 3 ? '0.05' : domain.length === 4 ? '0.03' : '0.01';
    	console.log("Minting domain", domain, "with price", price);
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

    			console.log("Going to pop wallet now to pay gas...")
          let tx = await contract.register(domain, {value: ethers.utils.parseEther(price)});
          // Wait for the transaction to be mined
    			const receipt = await tx.wait();

    			// Check if the transaction was successfully completed
    			if (receipt.status === 1) {
    				console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+tx.hash);

    				// Set the colour for the domain
    				tx = await contract.setColour(domain, colour);
    				await tx.wait();
    				console.log("Colour set! https://mumbai.polygonscan.com/tx/"+tx.hash);

            // Reset the state variables to refresh the UI
    				setColour('');
    				setDomain('');
    			}
    			else {
    				alert("Transaction failed! Please try again");
    			}
        }
      }
      catch(error){
        console.log(error);
      }
    }

  	const renderNotConnectedContainer = () => (
  		<div className="connect-wallet-container">
  			<img src="https://media.giphy.com/media/3o6Mbi33H758V6pJyo/giphy.gif" alt="Dog planet gif" />
  			<button className="cta-button connect-wallet-button" onClick={connectWallet}>
  				Connect Wallet
  			</button>
  		</div>
    	);

    // Form to enter domain name and data
    const renderInputForm = () => {
      if (network !== 'Polygon Mumbai Testnet') {
        return (
          <div className="connect-wallet-container">
            <img src="https://media.giphy.com/media/3o6Mbi33H758V6pJyo/giphy.gif" alt="Dog planet gif" />
            <h2>Please switch to Polygon Mumbai Testnet</h2>
            <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
				  </div>
        );
      }


      return (
        <div className="form-container">
          <div className="first-row">
            <input
              type="text"
              value={domain}
              placeholder='domain'
              onChange={e => setDomain(e.target.value)}
            />
            <p className='tld'> {tld} </p>
          </div>

          <input
            type="text"
            value={colour}
            placeholder='what color is the planet?'
            onChange={e => setColour(e.target.value)}
          />

          <div className="button-container">
            <button className='cta-button mint-button' disabled={null} onClick={mintDomain}>
              Mint
            </button>
            <button className='cta-button mint-button' disabled={null} onClick={null}>
              Set data
            </button>
          </div>

        </div>
      );
    }

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
              <p className="subtitle">The immortal naming service for the Andromeda galaxy on the blockchain!</p>
            </div>
            <div className="right">
              <img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
              { currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
            </div>
					</header>
				</div>

				{!currentAccount && renderNotConnectedContainer()}
				{currentAccount && renderInputForm()}

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
