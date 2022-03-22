const registerPlanet = async (user, planet) => {
    let txn = await domainContract.connect(user).register(planet,  {value: hre.ethers.utils.parseEther('0.1')});
    await txn.wait();
    const owner = await domainContract.getAddress(planet);
    console.log(planet, "has been registered. Owner:", owner);
    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const setColour = async (user, planet, colour) => {
    let txn = await domainContract.connect(user).setColour(planet, colour);
    await txn.wait();
    const pColour = await domainContract.getColour(planet);
    console.log(planet, "colour:", pColour);
};

const main = async () => {
    // The first return is the deployer, the second is a random account
    const [owner, person1, person2] = await hre.ethers.getSigners();

    // Deploy our contract
    const domainContractFactory = await hre.ethers.getContractFactory('Domains');
    domainContract = await domainContractFactory.deploy("andromeda");
    await domainContract.deployed();
    console.log("Contract deployed to:", domainContract.address, "by:", owner.address);

    // Register some planets
    await registerPlanet(person1, "mercury");

    // Colour some planets
    await setColour(person1, "mercury", "HOT PINK");

    //await setColour(person1, "mercury", "Lime Green");

    // await registerPlanet(person2, "venus");
    // await setColour(person2, "venus", "LIME GREEN");
    // Attempt to recolour a planet you don't own
    //await setColour(person1, "venus.andromeda", "BLACK");
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