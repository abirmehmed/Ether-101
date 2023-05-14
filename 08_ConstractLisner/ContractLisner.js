

// contractUSDT.on("event name", Listener)
// 2. Listen only once
// contractUSDT.once("event name", Listener)

import { ethers } from "ethers";

// Prepare alchemy API  
// You can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
// Connect to mainnet provider
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// USDT contract address
const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// Build USDT Transfer ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)"
];
// Create USDT contract object
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);


const main = async () => {
  // Listen to USDT contract Transfer event

  try{
    // Listen only once
    console.log("\n1. Use contract.once() to listen to the Transfer event once");
    contractUSDT.once('Transfer', (from, to, value)=>{
      // Print result
      console.log(
        `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })

    // Keep listening to USDT contract
    console.log("\n2. Use contract.on() to keep listening to the Transfer event");
    contractUSDT.on('Transfer', (from, to, value)=>{
      console.log(
       // Print result
       `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })

  }catch(e){
    console.log(e);

  } 
}
main()
