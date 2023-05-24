
---
title: 15. Batch Transfer
---

# Ethers Quick Start: 15. Batch Transfer

I've been re-learning `ethers.js` lately, consolidating some details, and also writing a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community**: [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lecture, we will introduce how to use `ethers.js` for batch transfer. By calling the `Airdrop` contract from [WTF Solidity Quick Start Lecture 33: Airdrop](https://github.com/AmazingAng/WTF-Solidity/blob/main/33_Airdrop/readme.md), we can achieve batch transfer in one transaction and save gas fees.

## Airdrop contract

Here we briefly introduce the `Airdrop` contract, details can be found in the Solidity tutorial. We will use `2` functions:

- `multiTransferETH()`: Batch send `ETH`, with `2` parameters:
    - `_addresses`: An array of user addresses receiving the airdrop (`address[]` type)
    - `_amounts`: An array of airdrop amounts, corresponding to the amount of each address in `_addresses` (`uint[]` type)


- `multiTransferToken()` function: Batch send `ERC20` tokens, with `3` parameters:
    - `_token`: Token contract address (`address` type)
    - `_addresses`: An array of user addresses receiving the airdrop (`address[]` type)
    - `_amounts`: An array of airdrop amounts, corresponding to the amount of each address in `_addresses` (`uint[]` type)

We deployed an `Airdrop` contract on the `Goerli` testnet, with address:
```
0x71C2aD976210264ff0468d43b198FD69772A25fa
```

## Batch Transfer

Next we write a script that calls the `Airdrop` contract to transfer `ETH` (native token) and `WETH` (ERC20 token) to `20` addresses.

1. Create HD wallet for generating addresses in bulk.
    ```js
    console.log("\n1. Create HD wallet")
    // Generate HD wallet from mnemonic phrase
    const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
    console.log(hdNode);
    ```

2. Use HD wallet to generate 20 wallet addresses.
    ```js
    console.log("\n2. Derive 20 wallets from HD wallet")
    const numWallet = 20
    // Derivation path: m / purpose' / coin_type' / account' / change / address_index
    // We only need to switch the last bit address_index, and we can derive new wallets from hdNode
    let basePath = "m/44'/60'/0'/0";
    let addresses = [];
    for (let i = 0; i < numWallet; i++) {
        let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
        let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
        addresses.push(walletNew.address);
    }
    console.log(addresses)
    const amounts = Array(20).fill(ethers.parseEther("0.0001"))
    console.log(`Send amount: ${amounts}`)
    ```
3. Create provider and wallet for sending tokens.

    ```js
    // Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTF-Solidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
    const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

    // Use private key and provider to create wallet object
    // If this wallet has no goerli testnet ETH
    // Please use your own small wallet for testing, wallet address: 0x338f8891D6BdC58eEB4754352459cC461EfD2a5E , please do not send any ETH to this address
    // Be careful not to upload your private key to github
    const privateKey = '0x21ac72b6ce19661adf31ef0d2bf8c3fcad003deee3dc1a1a64f5fa3d6b049c06'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```

4. Create Airdrop contract.
    ```js
    // Airdrop's ABI
    const abiAirdrop = [
        "function multiTransferToken(address,address[],uint256[]) external",
        "function multiTransferETH(address[],uint256[]) public payable",
    ];
    // Airdrop contract address (Goerli testnet)
    const addressAirdrop = '0x71C2aD976210264ff0468d43b198FD69772A25fa' // Airdrop Contract
    // Declare Airdrop contract
    const contractAirdrop = new ethers.Contract(addressAirdrop, abiAirdrop, wallet)
    ```
5. Create WETH contract.
    ```js
    // WETH's ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function transfer(address, uint) public returns (bool)",
        "function approve(address, uint256) public returns (bool)"
    ];
    // WETH contract address (Goerli testnet)
    const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' // WETH Contract
    // Declare WETH contract
    const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
    ```

6. Read the ETH and WETH balance of an address.
    ```js
    console.log("\n3. Read the ETH and WETH balance of an address")
    //Read WETH balance
    const balanceWETH = await contractWETH.balanceOf(addresses[10])
    console.log(`WETH holdings: ${ethers.formatEther(balanceWETH)}\n`)
    //Read ETH balance
    const balanceETH = await provider.getBalance(addresses[10])
    console.log(`ETH holdings: ${ethers.formatEther(balanceETH)}\n`)
    ```

8. Call multiTransferToken() function to transfer `0.0001 WETH` to each wallet, and you can see the balance changes after sending.

    ```js
    console.log("\n5. Call multiTransferToken() function to transfer 0.001 WETH to each wallet")
    // First approve WETH to Airdrop contract
    const txApprove = await contractWETH.approve(addressAirdrop, ethers.parseEther("1"))
    await txApprove.wait()
    // Initiate transaction
    const tx2 = await contractAirdrop.multiTransferToken(addressWETH, addresses, amounts)
    // Wait for transaction to be on chain
    await tx2.wait()
    // console.log(`Transaction details:`)
    // console.log(tx2)
    // Read WETH balance
    const balanceWETH2 = await contractWETH.balanceOf(addresses[10])
    console.log(`After sending, the wallet WETH holdings: ${ethers.formatEther(balanceWETH2)}\n`)
    ```
## Summary

In this lecture, we introduced how to use `ethers.js` to call the `Airdrop` contract for batch transfer. In the example, we sent `ETH` and `WETH` to `20` different addresses, saving time and money (gas fees).

