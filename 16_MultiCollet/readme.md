
---
title: 16. Batch Collection
---

# Ethers Getting Started: 16. Batch Collection

I've been relearning `ethers.js` recently to reinforce the details and also write a `WTF Ethers Getting Started` for beginners to use.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community**: [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lesson, we will introduce how to use `ethers.js` to collect `ETH` and tokens from multiple wallets into one wallet.

## Batch Collection

After interacting on-chain and taking advantage of opportunities, you need to collect and manage the assets of multiple wallets. You can use an [HD wallet](https://github.com/WTFAcademy/WTF-Ethers/blob/main/14_HDwallet/readme.md) or save multiple keys to operate multiple wallets, and then use an `ethers.js` script to complete the collection. Below we demonstrate the collection of `ETH` (native token) and `WETH` (ERC20 token) respectively.

1. Create a `provider` and `wallet`, where the `wallet` is the wallet that receives the assets.

    ```js
    // Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTF-Solidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
    const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
    // Use private key and provider to create wallet object
    const privateKey = '0x21ac72b6ce19661adf31ef0d2bf8c3fcad003deee3dc1a1a64f5fa3d6b049c06'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```
Here is the translation:

2. Declare the WETH contract.
    ```js
    // WETH ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function transfer(address, uint) public returns (bool)",
    ];
    // WETH contract address (Goerli testnet)
    const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' // WETH Contract
    // Declare WETH contract
    const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
    ```

3. Create an `HD` wallet to manage multiple wallets.

    ```js
    console.log("\n1. Create HD wallet")
    // Generate HD wallet from mnemonic
    const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
    console.log(hdNode);
    ```
4. Derive `20` wallets from the `HD` wallet, these wallets need to have assets.

    ```js
    const numWallet = 20
    // Derivation path: m / purpose' / coin_type' / account' / change / address_index
    // We only need to switch the last address_index to derive new wallets from hdNode
    let basePath = "m/44'/60'/0'/0";
    let wallets = [];
    for (let i = 0; i < numWallet; i++) {
        let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
        let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
        wallets.push(walletNew);
        console.log(walletNew.address)
    }
    // Define send amount
    const amount = ethers.parseEther("0.0001")
    console.log(`Send amount: ${amount}`)
    ```
5. Read the ETH and WETH balance of an address.

    ```js
    console.log("\n3. Read the ETH and WETH balance of an address")
    //Read WETH balance
    const balanceWETH = await contractWETH.balanceOf(wallets[19])
    console.log(`WETH holdings: ${ethersfromPhrase.formatEther(balanceWETH)}`)
    //Read ETH balance
    const balanceETH = await provider.getBalance(wallets[19])
    console.log(`ETH holdings: ${ethersfromPhrase.formatEther(balanceETH)}\n`)
    ```

6. Use the `sendTransaction()` method of the wallet class to send transactions and collect the `ETH` from each wallet.

    ```js
    // 6. Batch collect ETH from 20 wallets
    console.log("\n4. Batch collect ETH from 20 wallets")
    const txSendETH = {
        to: wallet.address,
        value: amount
    }
    for (let i = 0; i < numWallet; i++) {
        // Connect wallet to provider
        let walletiWithProvider = wallets[i].connect(provider)
        var tx = await walletiWithProvider.sendTransaction(txSendETH)
        console.log(`Start collecting ETH from wallet ${i+1} ${walletiWithProvider.address}`)
    }
    await tx.wait()
    console.log(`ETH collection completed`)
    ```
7. Connect the `WETH` contract to a new wallet and then call the `transfer()` method to collect the `WETH` from each wallet.

    ```js
    for (let i = 0; i < numWallet; i++) {
        // Connect wallet to provider
        let walletiWithProvider = wallets[i].connect(provider)
        // Connect contract to new wallet
        let contractConnected = contractWETH.connect(walletiWithProvider)
        var tx = await contractConnected.transfer(wallet.address, amount)
        console.log(`Start collecting WETH from wallet ${i+1} ${wallets[i].address}`)
    }
    await tx.wait()
    console.log(`WETH collection completed`)
    ```
8. Read the ETH and WETH balance of an address after collection, you can see that the `ETH` and `WETH` balances have decreased and the collection was successful!
    ```js
    console.log("\n6. Read the ETH and WETH balance of an address after collection")
    // Read WETH balance
    const balanceWETHAfter = await contractWETH.balanceOf(wallets[19])
    console.log(`WETH holdings after collection: ${ethersfromPhrase.formatEther(balanceWETHAfter)}`)
    // Read ETH balance
    const balanceETHAfter = await provider.getBalance(wallets[19])
    console.log(`ETH holdings after collection: ${ethersfromPhrase.formatEther(balanceETHAfter)}\n`)
    ```
## Summary

In this lesson, we introduced batch collection and used an `ethers.js` script to collect `ETH` and `WETH` from `20` wallets into one wallet.
