// Import ethers package
import { ethers } from "ethers";
// Since the free version of playcode cannot install ethers, this command can be used to import the package from the network (comment out the above line)
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

// Connect to the Ethereum network via Alchemy RPC node
// To prepare the Alchemy API, please refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
// Connect to Ethereum mainnet
const providerETH = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)
// Connect to Goerli testnet
const providerGoerli = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL)

const main = async () => {
// Read on-chain information using the provider
// 1. Query ETH balance of Vitalik on mainnet and Goerli testnet
console.log("1. Query ETH balance of Vitalik on mainnet and Goerli testnet");
const balance = await providerETH.getBalance(vitalik.eth);
const balanceGoerli = await providerGoerli.getBalance(vitalik.eth);
// Output the balance on console (mainnet)
console.log(ETH Balance of Vitalik: ${ethers.formatEther(balance)} ETH);
// Output Goerli testnet ETH balance
console.log(Goerli ETH Balance of Vitalik: ${ethers.formatEther(balanceGoerli)} ETH);
// 2. Query which network the provider is connected to
console.log("\n2. Query which network the provider is connected to")
const network = await providerETH.getNetwork();
console.log(network.toJSON());

// 3. Query block height
console.log("\n3. Query block height")
const blockNumber = await providerETH.getBlockNumber();
console.log(blockNumber);

// 4. Query transaction count of Vitalik's wallet
console.log("\n4. Query transaction count of Vitalik's wallet")
const txCount = await providerETH.getTransactionCount("vitalik.eth");
console.log(txCount);

// 5. Query current suggested gas settings
console.log("\n5. Query current suggested gas settings")
const feeData = await providerETH.getFeeData();
console.log(feeData);

// 6. Query block information
console.log("\n6. Query block information")
const block = await providerETH.getBlock(0);
console.log(block);

// 7. Query contract bytecode given a contract address, example uses WETH address
console.log("\n7. Query contract bytecode given a contract address, example uses WETH address")
const code = await providerETH.getCode("0xc778417e063141139fce010982780140aa0cd5ab");
console.log(code);
}

main()
