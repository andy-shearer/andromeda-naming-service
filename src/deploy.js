const main = async () => {
    // Deploy our contract
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    domainContract = await domainContractFactory.deploy("andromeda");
    await domainContract.deployed();

    console.log("Contract deployed to:", domainContract.address);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();