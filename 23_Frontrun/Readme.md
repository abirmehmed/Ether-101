# Ethers Quick Start: 23. Front-running Script

I recently started learning `ethers.js` again to solidify some details and create a "WTF Ethers Quick Start" guide for beginners.

Twitter: [@0xAA_Science](https://twitter.com/0xAA_Science)｜[@WTFAcademy_](https://twitter.com/WTFAcademy_)

WTF Academy Community: [Discord](https://discord.gg/5akcruXrsk)｜[WeChat Group](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)｜[Official Website: wtf.academy](https://wtf.academy)

All code and tutorials are open source on GitHub: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

---

In this tutorial, we will introduce a front-running script for Ethereum transactions. According to statistics, arbitrageurs on Ethereum have made $1.2 billion in profits through sandwich attacks [source](https://dune.com/chorus_one/ethereum-mev-data). Before diving into the tutorial, please read the [WTF Solidity tutorial on front-running](https://github.com/AmazingAng/WTFSolidity/blob/main/S11_Frontrun/readme.md).

![](./img/23-1.png)

## Freemint NFT Contract

The target contract we will be front-running is an ERC721 standard NFT contract called `Frontrun.sol`, which has a `mint()` function for free minting.

```solidity
// SPDX-License-Identifier: MIT
// By 0xAA
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// We attempt to front-run a Free mint transaction
contract FreeMint is ERC721 {
    uint256 public totalSupply;

    // Constructor to initialize the NFT collection's name and symbol
    constructor() ERC721("Free Mint NFT", "FreeMint"){}

    // Minting function
    function mint() external {
        _mint(msg.sender, totalSupply); // mint
        totalSupply++;
    }
}
```

To simplify the testing environment, we will deploy this contract on the local testnet called Foundry, and then listen for pending transactions in the mempool that meet certain criteria for front-running.

If you are not familiar with Foundry, you can read the [Foundry tutorial in the WTF Solidity repository](https://github.com/AmazingAng/WTF-Solidity/blob/main/Topics/Tools/TOOL07_Foundry/readme.md). After installing Foundry, you can start the local testnet by running the following command in the terminal:

```shell
anvil
```

## Front-running Script

Now let's dive into the front-running script `frontrun.js`, which will listen for `mint()` transactions on the chain and send a higher gas price transaction to front-run the original transaction.

1. Create a `provider` object connected to the local Foundry testnet to listen for and send transactions. The default URL for the local Foundry testnet is `"http://127.0.0.1:8545"`.
    ```js
    import { ethers } from "ethers";

    // 1. Create provider
    var url = "http://127.0.0.1:8545";
    const provider = new ethers.WebSocketProvider(url);
    let network = provider.getNetwork()
    network.then(res => console.log(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}`));
    ```

2. Create an `interface` object that includes the `mint()` function we are interested in, which will be used to decode the transaction. If you are unfamiliar with it, you can read the [WTF Ethers tutorial on decoding transactions](https://github.com/WTFAcademy/WTFEthers/blob/main/20_DecodeTx/readme.md).
    ```js
    // 2. Create interface object for decoding transaction details
    const iface = new ethers.Interface([
        "function mint() external",
    ])
    ```

3. Create a test wallet to send the front-running transaction. The private key provided by the Foundry testnet contains 10000 ETH for testing purposes.

    ```js
    // 3. Create wallet for sending front-running transaction
    const privateKey = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```

4. Use the `provider.on` method to listen for pending transactions in the mempool. When a transaction is found, retrieve the transaction details using the transaction hash `txHash` and filter out transactions that call the `mint()` function and are not sent from the wallet's own address (to avoid front-running our own transactions). Then, print the filtered transaction hash.

    ```js
    provider.on("pending", async (txHash) => {
        if (txHash) {
            // Get transaction details
            let tx = await provider.getTransaction(txHash);
            if (tx) {
                // Filter pendingTx.data
                if (tx.data.indexOf(iface.getFunction("mint").selector) !== -1 && tx.from != wallet.address ) {
                    // Print txHash
                    console.log(`\n[${(new Date).toLocaleTimeString()}] Listening to Pending transaction: ${txHash} \r`);
    ```
    ![](./img/23-2.png)

5. Print the details of the filtered pending transaction.

    ```js
    // Print raw transaction
    console.log("raw transaction")
    console.log(tx);
    ```   
    ![](./img/23-3.png)

6. Print the decoded transaction details, which shows that the transaction is calling the `mint()` function.

    ```js
    // Print parsed transaction details
    let parsedTx = iface.parseTransaction(tx)
    console.log("Decoded details of the pending transaction:")
    console.log(parsedTx);
    ```
    ![](./img/23-4.png)

7. Build the front-running transaction `txFrontrun` by keeping the target address `to`, the amount of ETH to send `value`, and the data `data` of the original transaction unchanged. Then, increase the `gas` parameters: `maxPriorityFeePerGas` and `maxFeePerGas` to 1.2 times the original values, and set the `gasLimit` to a maximum of 2 times the original value. Finally, use `sendTransaction()` to send the transaction to the chain and complete the front-running!

    ```js
    // Build front-running tx
    const txFrontrun = {
        to: tx.to,
        value: tx.value,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 2n,
        maxFeePerGas: tx.maxFeePerGas * 2n,
        gasLimit: tx.gasLimit * 2,
        data: tx.data
    }
    // Send the front-running transaction
    var txResponse = await wallet.sendTransaction(txFrontrun)
    console.log(`Front-running transaction in progress`)
    await txResponse.wait()
    console.log(`Front-running transaction successful`)   
    ```

    ![](./img/23-5.png)

## Summary

In this tutorial, we introduced a simple front-running script. You can add additional functionalities to this script and embark on the path of becoming a crypto scientist!
