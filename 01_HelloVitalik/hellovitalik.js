// import ethers package
import { ethers } from "ethers";
// playcode free version cannot install ethers, use this command, need to import package from the network (comment out the line above)
// import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.2.3/ethers.js";

// use ethers default Provider to connect to Ethereum network
// const provider = new ethers.getDefaultProvider();
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)

const main = async () => {
    // query vitalik’s ETH balance
    const balance = await provider.getBalance(`vitalik.eth`);
    //output the balance in the console
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);}
main()
