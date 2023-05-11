// The method to query events:
// const transferEvents = await contract.queryFilter("event name", [start block height, end block height])
// The start block height and end block height are optional parameters.

import { ethers } from "ethers";
// playcode free version cannot install ethers, use this command, need to import the package from the network (comment out the line above)
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// Connect to the Ethereum network using Alchemy's rpc node
// To prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// WETH ABI, only includes the Transfer event we care about
const abiWETH = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

// Testnet WETH address
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
// Declare contract instance
const contract = new ethers.Contract(addressWETH, abiWETH, provider)

const main = async () => {

    // Get the Transfer events in the past 10 blocks
    console.log("\n1. Get the Transfer events in the past 10 blocks and print out one");
    // Get the current block
    const block = await provider.getBlockNumber()
    console.log(`Current block height: ${block}`);
    console.log(`Print event details:`);
    const transferEvents = await contract.queryFilter('Transfer', block - 10, block)
    // Print the first Transfer event
    console.log(transferEvents[0])

    // Parse the Transfer event data (variables are in args)
    console.log("\n2. Parse event:")
    const amount = ethers.formatUnits(ethers.getBigInt(transferEvents[0].args["amount"]), "ether");
    console.log(`Address ${transferEvents[0].args["from"]} transferred ${amount} WETH to address ${transferEvents[0].args["to"]}`)
}

main()
