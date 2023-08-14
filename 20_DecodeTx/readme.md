 ---
title: 20. Decoding Transaction Details
---

# Ethers Quick Start Guide: 20. Decoding Transaction Details

I have recently been relearning `ethers.js` to review some details and write a `WTF Ethers Quick Start Guide` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official Website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat Group Application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorial are open source on GitHub: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lesson, we will use a pending transaction as an example to demonstrate how to decode transaction details.

## Pending Transactions

A pending transaction is a transaction sent by a user that has not been mined by a miner and is waiting in the mempool. For more information on `mempool`, please refer to the [WTF Ethers Quick Start Guide Lesson 19: Listening to Mempool](https://github.com/WTFAcademy/WTF-Ethers/blob/main/19_Mempool/readme.md).

Below is an example of a pending `ERC20` token transfer transaction. You can view the transaction details on [etherscan](https://etherscan.io/tx/0xbe5af8b8885ea9d6ae8a2f3f44315554ff62daebf3f99b42eae9d4cda880208e):

![ERC20 Pending Transaction](./img/20-1.png)

The red box is the `input data` of this transaction, which is a seemingly random hexadecimal string of data that actually encodes the content of this transaction, including the function called and the input parameters. By clicking the **Decode Input Data** button on etherscan, we can decode this data:

![Decode Input Data](./img/20-2.png)

After decoding, we can see the function called and the input parameters of this transaction.

## Interface Class

`ethers.js` provides the `Interface` class to facilitate decoding transaction data. The declaration of the `Interface` type is similar to that of declaring `abi`, for example:

```js
const iface = ethers.Interface([
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
    "function approve(address, uint256) public returns (bool)"
]);
```

## Decoding Transaction Data

Now we will write a script to decode the data of a pending transaction.

1. Create a `provider` and `wallet`. When listening to transactions, it is recommended to use `wss` connections instead of `http`.

    ```js
    // Prepare Alchemy API - See https://github.com/AmazingAng/WTF-Solidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md for reference
    const ALCHEMY_MAINNET_WSSURL = 'wss://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVk
