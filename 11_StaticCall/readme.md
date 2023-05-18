
---
title: 11. StaticCall
---

# Ethers Quick Start: 11. StaticCall

I've been re-learning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTFEthers)

-----

In this lesson, we introduce the `staticCall` method of the contract class, which checks whether a transaction will fail before sending it, saving a lot of gas.

The `staticCall` method is a writing method analysis belonging to the ```ethers.Contract``` class. Similar methods are `populateTransaction` and `estimateGas`.

## Transactions that may fail

Sending transactions on Ethereum requires paying expensive `gas`, and there is a risk of failure. Sending failed transactions will not return your `gas` to you. Therefore, knowing which transactions may fail before sending them is very important. If you have used the `metamask` fox wallet, you will not be unfamiliar with the picture below.

If your transaction will fail, the fox will tell you `this transaction may fail`, which translates to "This transaction may fail". When users see this red prompt, they know to cancel the transaction, unless they want to taste the failure.

How does it do it? This is because the Ethereum node has an `eth_call` method that allows users to simulate a transaction and return possible transaction results, but not actually execute it on the blockchain (transaction does not go on chain).

## `staticCall`

In `ethers.js` you can use the `contract` object's `staticCall()` method to call the Ethereum node's `eth_call`. If the call succeeds, it returns `true`; if it fails, it throws an error and returns the reason for the failure. Method:

```js
    const tx = await contract.functionName.staticCall( arguments, {override})
    console.log(`Will the transaction succeed?：`, tx)
```

- functionName: The name of the function to simulate calling.
- arguments: The arguments for calling the function.
- {override}: Optional, can contain the following parameters:
    - `from`: The `msg.sender` when executing, which means you can simulate anyone's call, such as Vitalik.
    - `value`: The `msg.value` when executing.
    - `blockTag`: The block height when executing.
    - `gasPrice`
    - `gasLimit`
    - `nonce`

## Use `staticCall` to simulate DAI transfer

1. Create `provider` and `wallet` objects.
    ```js
    import { ethers } from "ethers";

    //prepare alchemy API can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
    const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

    // use private key and provider to create wallet object
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```

2. Create DAI contract object. Note that when creating a contract here, you need to use `provider` instead of `wallet`, otherwise you cannot change the `from` in the `staticCall` method (it may be a bug or a feature).

    ```js
    // DAI's ABI
    const abiDAI = [
        "function balanceOf(address) public view returns(uint)",
        "function transfer(address, uint) public returns (bool)",
    ];
    // DAI contract address (mainnet)
    const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
    // create DAI contract instance
    const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)
    ```

