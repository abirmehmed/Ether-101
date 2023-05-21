---
title: 13. Encode calldata
---

# Ethers Quick Start: 13. Encode calldata

I've been re-learning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTFEthers)

-----

In this lecture, we will introduce the interface class in `ethers.js` and use it to encode `calldata`.

## Interface class Interface

The interface class in `ethers.js` abstracts the `ABI` encoding and decoding required for interacting with contracts on the Ethereum network. `ABI` (Application Binary Interface) is similar to `API`, it is a format for encoding various types of data that contracts can handle so that they can interact. For more details, see [WTF Solidity Tutorial Lecture 27 ABI Encoding](https://github.com/AmazingAng/WTFSolidity/tree/main/27_ABIEncode).

We can use `abi` to generate or get the `interface` variable directly from the contract:

```js
// Generate using abi
const interface = ethers.Interface(abi)
// Get directly from contract
const interface2 = contract.interface
```

The interface class encapsulates some encoding and decoding methods. When interacting with some special contracts (such as proxy contracts), you need to encode parameters and decode return values:

**Note**: The relevant functions must be included in the `abi`.

- `getSighash()`: Get the function selector, the parameter is the function name or function signature.

    ```js
    interface.getSighash("balanceOf");
    // '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ```
- `encodeDeploy()`: Encode the constructor's arguments, then you can append them to the contract bytecode.
    ```js
    interface.encodeDeploy("Wrapped ETH", "WETH");
    ```

- `encodeFunctionData()`: Encode the function's `calldata`.

    ```js
    interface.encodeFunctionData("balanceOf", ["0xc778417e063141139fce010982780140aa0cd5ab"]);
    ```
- `decodeFunctionResult()`: Decode the function's return value.
    ```js
    interface.decodeFunctionResult("balanceOf", resultData)
    ```

## Example: Interact with testnet `WETH` contract
Here is my attempt to translate this to English:

Here, we use the interface class method to encode `calldata`, and repeat the example of interacting with the testnet `WETH` contract from [Lecture 5](https://github.com/WTFAcademy/WTFEthers/blob/main/05_WriteContract/readme.md).

1. Create `provider`, `wallet` variables.

    ```js
    // Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
    const ALCHEMY_GOERLI_URL = 'https://eth-rinkeby.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

    // Create wallet object using private key and provider
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```

2. Create `WETH` contract instance
    ```js
    // WETH's ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function deposit() public payable",
    ];
    // WETH contract address (Goerli testnet)
    const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
    // Declare WETH contract
    const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)
    ```

3. Call `balanceOf()` function, read the `WETH` balance of wallet address `address`.

    ```js
    const address = await wallet.getAddress()
    // 1. Read the on-chain information of the WETH contract (WETH abi)
    console.log("\n1. Read WETH balance")
    // Encode calldata
    const param1 = contractWETH.interface.encodeFunctionData(
        "balanceOf",
        [address]
      );
    console.log(`Encoding result: ${param1}`)
    // Create transaction
    const tx1 = {
        to: addressWETH,
        data: param1
    }
    // Send transaction, read-only operations (view/pure) can use provider.call(tx)
    const balanceWETH = await provider.call(tx1)
    console.log(`WETH balance before deposit: ${ethers.formatEther(balanceWETH)}\n`)
    ```
    Here is my attempt to translate this to English:

4. Call `deposit()` function, convert `0.001 ETH` to `0.001 WETH`, print transaction details and balance. You can see the balance change.

    ```js
    // Encode calldata
    const param2 = contractWETH.interface.encodeFunctionData(
        "deposit"          
        );
    console.log(`Encoding result: ${param2}`)
    // Create transaction
    const tx2 = {
        to: addressWETH,
        data: param2,
        value: ethers.parseEther("0.001")}
    // Send transaction, write operations need wallet.sendTransaction(tx)
    const receipt1 = await wallet.sendTransaction(tx2)
    // Wait for transaction to be mined
    await receipt1.wait()
    console.log(`Transaction details:`)
    console.log(receipt1)
    const balanceWETH_deposit = await contractWETH.balanceOf(address)
    console.log(`WETH balance after deposit: ${ethers.formatEther(balanceWETH_deposit)}\n`)
    ```
## Summary

In this lecture, we introduced the interface class in `ethers.js` and used it to encode `calldata` and interact with the `WETH` contract. When interacting with some special contracts (such as proxy contracts), you need to use these methods to encode parameters and then decode return values.
