
---
title: 5. Contract Interaction
---

# Ethers Quick Start: 5. Contract Interaction

I've been re-learning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lecture, we will introduce how to declare a writable `Contract` variable and use it to interact with the `WETH` contract on the testnet.

## Create a writable `Contract` variable

The rule for declaring a writable `Contract` variable is:
```js
const contract = new ethers.Contract(address, abi, signer)
```

Where `address` is the contract address, `abi` is the contract's `abi` interface, and `signer` is the `wallet` object. Note that here you need to provide a `signer`, whereas when declaring a readable contract you only need to provide a `provider`.

You can also use the following method to convert a readable contract to a writable contract:

```js
const contract2 = contract.connect(signer)
```

## Contract Interaction

We introduced reading contract information in [Lecture 3](https://github.com/WTFAcademy/WTFEthers/blob/main/03_ReadContract/readme.md). It does not require `gas`. Here we introduce writing contract information, which requires you to construct a transaction and pay `gas`. The transaction will be verified by every node and miner on the network and change the state of the blockchain.

You can use the following method to interact with the contract:

```js
// Send transaction
const tx = await contract.METHOD_NAME(args [, overrides])
// Wait for confirmation on chain
await tx.wait() 
```

Where `METHOD_NAME` is the name of the function to call, `args` are the function arguments, and `[, overrides]` are optional data that can be passed in, including:
- gasPrice: gas price
- gasLimit: gas limit
- value: ether passed in when calling (unit is wei)
- nonce: nonce

**Note:** This method cannot get the return value of the contract execution. If needed, use `Solidity` events to log and then query using the transaction receipt.

## Example: Interacting with the testnet `WETH` contract

`WETH` (Wrapped ETH) is the wrapped version of `ETH`, which wraps the native token of Ethereum into a smart contract that conforms to `ERC20`. For more details on the `WETH` contract, please refer to WTF Solidity Quick Contract's [Lecture 41 WETH](https://github.com/AmazingAng/WTFSolidity/blob/main/41_WETH/readme.md).


1. Create `provider`, `wallet` variables.

    ```js
    import { ethers } from "ethers";

    // Connect to the Ethereum network using Alchemy's rpc node
    const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

    // Create a wallet object using a private key and provider
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```
2. Create a writable `WETH` contract variable, we added 4 functions we want to call in the `ABI`:
    - `balanceOf(address)`: Query the `WETH` balance of an address.
    - `deposit()`: Convert the `ETH` transferred to the contract into `WETH`.
    - `transfer(adress, uint256)`: Transfer.
    - `withdraw(uint256)`: Withdraw.
    ```js
    // WETH's ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function deposit() public payable",
        "function transfer(address, uint) public returns (bool)",
        "function withdraw(uint) public",
    ];
    // WETH contract address (Goerli testnet)
    const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6' // WETH Contract

    // Declare a writable contract
    const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
    // You can also declare a read-only contract and then use the connect(wallet) function to convert it to a writable contract.
    // const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
    // contractWETH.connect(wallet)
    ```

3. Read the account's `WETH` balance, you can see that the balance is `1.001997`.

    ```js
    const address = await wallet.getAddress()
    // Read the on-chain information of the WETH contract (WETH abi)
    console.log("\n1. Read WETH balance")
    const balanceWETH = await contractWETH.balanceOf(address)
    console.log(`WETH position before deposit: ${ethers.formatEther(balanceWETH)}\n`)
    ```

4. Call the `WETH` contract's `deposit()` function to convert `0.001 ETH` to `0.001 WETH`, print the transaction details and balance. The `deposit()` function has no arguments, you can see that the balance changes to `1.002997`.

    ```js
        console.log("\n2. Call the desposit() function and deposit 0.001 ETH")
        // Initiate transaction
        const tx = await contractWETH.deposit({value: ethers.parseEther("0.001")})
        // Wait for transaction to be on-chain
        await tx.wait()
        console.log(`Transaction details:`)
        console.log(tx)
        const balanceWETH_deposit = await contractWETH.balanceOf(address)
        console.log(`WETH position after deposit: ${ethers.formatEther(balanceWETH_deposit)}\n`)
    ```
  Here is the translation:

5. Call the `WETH` contract's `transfer()` function to transfer `0.001 WETH` to Vitalik, and print the balance. You can see that the balance changes to `1.001997`.

    ```js
        console.log("\n3. Call the transfer() function and transfer 0.001 WETH to vitalik")
        // Initiate transaction
        const tx2 = await contractWETH.transfer("vitalik.eth", ethers.parseEther("0.001"))
        // Wait for transaction to be on-chain
        await tx2.wait()
        const balanceWETH_transfer = await contractWETH.balanceOf(address)
        console.log(`WETH position after transfer: ${ethers.formatEther(balanceWETH_transfer)}\n`)
    ```
**Note**: Observe the `deposit()` function and the `balanceOf()` function, why are their return values different? Why does the former return a bunch of data, while the latter only returns a definite value? This is because for the wallet balance, it is a read-only operation, what you read is what you get. But for a function call, you don't know when the data will be on-chain, so it will only return the information of this transaction. In summary, for non-`pure`/`view` function calls, it will return transaction information. If you want to know how the contract variables change during the function execution, you can use `emit` to output events in the contract, and read the event information in the returned `transaction` information to get the corresponding values.

## Summary

In this lecture, we introduced how to declare a writable `Contract` variable and use it to interact with the `WETH` contract on the testnet. We not only called the `WETH`'s `deposit()` function to convert `0.001 ETH` to `WETH`, but also transferred it to Vitalik.
