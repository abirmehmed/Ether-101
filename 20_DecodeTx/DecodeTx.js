// provider.on("pending", listener)
import { ethers } from "ethers";

// 1. Create provider and wallet, it is recommended to use wss connection instead of http when listening for events
// Preparing the Alchemy API can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_WSSURL = 'wss://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}`));

// 2. Create an interface object for decoding transaction details
const iface = new ethers.Interface([
    "function transfer(address, uint) public returns (bool)",
])

// 3. Limit access to rpc speed, otherwise the call frequency will exceed the limit and cause errors.
function throttle(fn, delay) {
    let timer;
    return function(){
        if(!timer) {
            fn.apply(this, arguments)
            timer = setTimeout(()=>{
                clearTimeout(timer)
                timer = null
            },delay)
        }
    }
}

const main = async () => {
    // 4. Listen for pending erc20 transfer transactions, get transaction details, and then decode them.
    console.log("\n4. Listen for pending transactions, get the txHash, and output the transaction details.")
    provider.on("pending", throttle(async (txHash) => {
        if (txHash) {
            // Get tx details
            let tx = await provider.getTransaction(txHash);
            if (tx) {
                // filter pendingTx.data
                if (tx.data.indexOf(iface.getFunction("transfer").selector) !== -1) {
                    // Print txHash
                    console.log(`\n[${(new Date).toLocaleTimeString()}] Listening pending transaction: ${txHash} \r`);

                    // Print decoded transaction details
                    let parsedTx = iface.parseTransaction(tx)
                    console.log("Decoded pending transaction details:")
                    console.log(parsedTx);
                    // Decode Input data
                    console.log("Decoded Input Data:")
                    console.log(parsedTx.args);
                }
            }
        }
    }, 100));
};

main()
