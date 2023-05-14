
import { ethers } from "ethers";

// Connect to Ethereum network using Alchemy's rpc node
// Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// Contract address
const addressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// Exchange address
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60'
// Build ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)",
  "function balanceOf(address) public view returns(uint)",
];
// Create contract object
const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);


(async () => {
  try {
    // 1. Read the USDT balance of Binance hot wallet
    console.log("\n1. Read the USDT balance of Binance hot wallet")
    const balanceUSDT = await contractUSDT.balanceOf(accountBinance)
    console.log(`USDT balance: ${ethers.formatUnits(ethers.getBigInt(balanceUSDT),6)}\n`)

    // 2. Create a filter to listen to transfers of USDT into the exchange
    console.log("\n2. Create a filter to listen to transfers of USDT into the exchange")
    let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
    console.log("Filter details:")
    console.log(filterBinanceIn);
    contractUSDT.on(filterBinanceIn, (from, to, value) => {
      console.log('---------Listening to USDT transfers into the exchange--------');
      console.log(
        `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })

    // 3. Create a filter to listen to transfers of USDT out of the exchange
    let filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance, null);
    console.log("\n3. Create a filter to listen to transfers of USDT out of the exchange")
    console.log("Filter details:")
    console.log(filterToBinanceOut);
    contractUSDT.on(filterToBinanceOut, (from, to, value) => {
      console.log('---------Listening to USDT transfers out of the exchange--------');
      console.log(
        `${from} -> ${to} ${ethers.formatUnits(ethers.BigNumber.from(value),6)}`
      )
    }
    );
  } catch (e) {
    console.log(e);
  }
})()

Source: Conversation with Bing, 5/14/2023
(1) Alchemy - the web3 development platform. https://www.alchemy.com/.
(2) Alchemy API Reference Overview. https://docs.alchemy.com/reference/api-overview.
(3) AlchemyAPI - Wikipedia. https://en.wikipedia.org/wiki/AlchemyAPI.
(4) Alchemy Docs. https://docs.alchemy.com/.
