
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

