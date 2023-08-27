### 22. Read Any Data

I have recently been learning `ethers.js` to solidify the details and write a "WTF Ethers Beginner's Guide" for beginners to use.

Twitter: [@0xAA_Science](https://twitter.com/0xAA_Science) | [@WTFAcademy_](https://twitter.com/WTFAcademy_)

WTF Academy Community: [Discord](https://discord.gg/5akcruXrsk) | [WeChat Group](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link) | [Official Website wtf.academy](https://wtf.academy)

All the code and tutorials are open source on GitHub: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

---

All data on Ethereum is public, so `private` variables are not actually private. In this lesson, we will learn how to read any data from a smart contract.

## Smart Contract Storage Layout

The storage of an Ethereum smart contract is a mapping of `uint256 -> uint256`. The size of a `uint256` is `32 bytes`, and this fixed-size storage space is called a `slot`. The data of a smart contract is stored in individual slots, starting from `slot 0` and continuing sequentially. Each primitive data type occupies one slot, such as `uint`, `address`, and so on. Arrays and mappings, which are more complex structures, have a more complicated storage layout, as described in the [documentation](https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html?highlight=Layout%20of%20State%20Variables%20in%20Storage).

![](./img/22-1.png)

Therefore, even if a `private` variable does not have a `getter` function, you can still read its value by indexing the slot.

## `getStorageAt`

`ethers.js` provides the `getStorageAt()` function to conveniently read the value of a specific slot:

```js
const value = await provider.getStorageAt(contractAddress, slot)
```

`getStorageAt()` takes two parameters: the contract address `contractAddress` and the index of the variable's slot that you want to read.

## Reading Any Data Script

Next, we will write a script that uses the `getStorageAt()` function to read the owner of the Arbitrum cross-chain bridge contract. This cross-chain bridge is an upgradable proxy contract, and the `owner` is stored in a specific slot to avoid variable collisions, without having a function to read it. In this case, we can use `getStorageAt()` to read it.

```solidity
Contract address: 0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a
Slot index: 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103
```

Running the script will output:

![](./img/22-2.png)

Code:

```js
import { ethers } from "ethers";

// Prepare Alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// Target contract address: Arbitrum ERC20 bridge (Mainnet)
const addressBridge = '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a' // DAI Contract
// Owner slot
const slot = `0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103`

const main = async () => {
    console.log("Reading data from a specific slot")
    const privateData = await provider.getStorage(addressBridge, slot)
    console.log("Read data (owner address): ", ethers.getAddress(ethers.dataSlice(privateData, 12)))    
}

main()
```

## Summary

In this lesson, we learned how to read any data from a smart contract, including private data. Since Ethereum is transparent and public, it is important not to store secrets in smart contracts.
