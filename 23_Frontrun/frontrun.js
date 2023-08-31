import { ethers } from "ethers";

// 1. Create a provider
var url = "ws://127.0.0.1:8545";
const provider = new ethers.WebSocketProvider(url);
let network = provider.getNetwork()
network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}`));

// 2. Create an interface object for decoding transaction details.
const iface = new ethers.Interface([
    "function mint() external",
])

// 3. Create a wallet for sending frontrun transactions.
const privateKey = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
const wallet = new ethers.Wallet(privateKey, provider)

const main = async () => {
    // 4. Listen for pending transactions, get the txHash, output the transaction details, and send the frontrun transaction.
    console.log("\n4. Listen for pending transactions, get the txHash, output the transaction details, and send the frontrun transaction.")
    provider.on("pending", async (txHash) => {
        if (txHash) {
            // Get transaction details
            let tx = await provider.getTransaction(txHash);
            if (tx) {
                // Filter pendingTx.data
                if (tx.data.indexOf(iface.getFunction("mint").selector) !== -1 && tx.from != wallet.address ) {
                    // Print txHash
                    console.log(`\n[${(new Date).toLocaleTimeString()}] Listening to Pending transaction: ${txHash} \r`);

                    // Print raw transaction
                    console.log("Raw transaction")
                    console.log(tx);
                    
                    // Print decoded transaction result
                    let parsedTx = iface.parseTransaction(tx)
                    console.log("Decoded pending transaction details:")
                    console.log(parsedTx);

                    // Build frontrun tx
                    const txFrontrun = {
                        to: tx.to,
                        value: tx.value,
                        maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 2n,
                        maxFeePerGas: tx.maxFeePerGas * 2n,
                        gasLimit: tx.gasLimit * 2n,
                        data: tx.data
                    }
                    // Send frontrun transaction
                    var txResponse = await wallet.sendTransaction(txFrontrun)
                    console.log(`Sending frontrun transaction`)
                    await txResponse.wait()
                    console.log(`Frontrun transaction successful`)                
                }
            }
        }
    });
};

main()
