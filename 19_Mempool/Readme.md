# Ethers Beginner's Guide: 19. Listening to Mempool

I've been learning `ethers.js` recently to strengthen my understanding of the details and to create a beginner's guide called "WTF Ethers". It's intended for newcomers to use.

**Twitter:** [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy community:** [Official Website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [Discord](https://discord.gg/5akcruXrsk) | [WeChat Group Application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All the code and tutorials are open-source on GitHub: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lesson, we will learn how to read transactions from the mempool (transaction memory pool).

## MEV

MEV (Maximal Extractable Value) is a fascinating topic. Most people are unfamiliar with it because it didn't exist before the invention of blockchain technologies that support smart contracts. MEV is a feast for scientists, a friend of miners, and a nightmare for retail investors.

In blockchain networks, miners can profit by bundling, excluding, or reordering transactions in the blocks they produce, and MEV is a metric that measures this profit.

## Mempool

Before a user's transaction is included in the Ethereum blockchain by miners, all transactions are collected in the mempool (transaction memory pool). Miners also search for transactions with higher gas fees in the mempool to maximize their profits. Generally, transactions with higher gas prices are more likely to be included in blocks.

Additionally, some MEV bots search for profitable transactions in the mempool. For example, a swap transaction with a high slippage setting could be vulnerable to sandwich attacks. By adjusting the gas, these bots can insert a buy order before the transaction and a sell order after, effectively selling the tokens at a higher price to users.

![Mempool](./img/19-1.png)

## Listening to the Mempool

You can use the `Provider` class provided by `ethers.js` to listen to pending transactions in the mempool:

```js
provider.on("pending", listener)
```

## Mempool Listening Script

Now, let's write a script to listen to the mempool.

1. Create the provider and wallet. This time, we'll use the WebSocket Provider for a more persistent transaction listener. Therefore, we need to change the URL to a `wss` URL.

    ```js
    console.log("\n1. Connect to wss RPC")
    // Prepare your Alchemy API key, you can refer to https://github.com/AmazingAng/WTF-Solidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
    const ALCHEMY_MAINNET_WSSURL = 'wss://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
    const provider = new ethers.WebSocketProvider(ALCHEMY_MAINNET_WSSURL);
    ```

2. Because there are many pending transactions in the mempool, sometimes hundreds per second, it's easy to reach the request limit of free RPC nodes. Therefore, we need to throttle the request frequency.

    ```js
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
    ```

3. Listen to pending transactions in the mempool and print the transaction hash.

    ```js
    let i = 0
    provider.on("pending", async (txHash) => {
        if (txHash && i < 100) {
            // Print the txHash
            console.log(`[${(new Date).toLocaleTimeString()}] Listening to Pending Transaction ${i}: ${txHash} \r`);
            i++
        }
    });
    ```
    ![Get pending transaction hashes](./img/19-2.png)

4. Retrieve transaction details using the hash of the pending transaction. We can see that the transaction hasn't been mined yet, so its `blockHash`, `blockNumber`, and `transactionIndex` are all empty. However, we can access other information such as the sender's address `from`, gas price `gasPrice`, recipient address `to`, sent Ether amount `value`, and transaction data `data`. MEV bots use this information for MEV extraction.

    ```js
    let j = 0
    provider.on("pending", throttle(async (txHash) => {
        if (txHash && j >= 100) {
            // Get transaction details
            let tx = await provider.getTransaction(txHash);
            console.log(`\n[${(new Date).toLocaleTimeString()}] Listening to Pending Transaction ${j}: ${txHash} \r`);
            console.log(tx);
            j++
        }
    }, 1000));
    ```
    ![Get transaction details](./img/19-3.png)

## Summary

In this lesson, we briefly introduced MEV and the mempool, and wrote a script to listen to pending transactions in the mempool.

