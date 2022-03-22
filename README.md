# buildspace 🦄 DNS starter project
## Andromeda Galaxy Planet Naming Service 🪐
Project to practice building a smart contract handling domain name records, and interacting with the contract via a React
front-end. See useful setup and deployment instructions below.

![](/Users/andyshearer/Documents/dev/domain-starter/src/assets/screenshot.png "screenshot of project")

### **Get Started 🎬**

To get started, clone this repo and follow these commands:

1. Run `npm install` at the root of your directory
2. Run `npx hardhat run scripts/run.js` to deploy the contract within the [Hardhat](https://hardhat.org/getting-started/) local development blockchain and create an example record
3. Run `npx hardhat run scripts/deploy.js --network mumbai` to deploy the contract to the Polygon Mumbai Testnet.
See [src/utils/networks.js](./src/utils/networks.js) for other networks.
4. Run `npm start` to start the React development server and automatically open the app in a new browser window

### Updating and redeploying the contract
When changing the code in the smart contract, it must be redeployed. Run the command in step 3 above to deploy it to the
Mumbai Testnet. The deploy script will log the address of the deployed contract to the console when it deploys successfully.

The compilation of the new contract will result in a new Application Binary Interface (ABI). Copy this from the local artifacts directory to the assets directory `src/assets`.

Finally, copy the new deployed contract address and replace the `CONTRACT_ADDRESS` constant within `App.js` so that the front end is communicating
with the newly deployed contract.