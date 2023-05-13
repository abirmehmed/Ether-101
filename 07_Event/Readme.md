
---
title: 7. Query Events
---

# Ethers Quick Start: 7. Query Events

I've been relearning `ethers.js` lately, consolidating some details, and also writing a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

Tip: This tutorial is based on ethers.js 6.3.0, if you are using v5, you can refer to [ethers.js v5 documentation](https://docs.ethers.io/v5/).

In this lecture, we will introduce how to use `ethers.js` to read events emitted by smart contracts. If you are not familiar with `Solidity` events, you can read WTF Solidity Quick Tutorial [Lecture 12: Events](https://github.com/AmazingAng/WTFSolidity/blob/main/12_Event/readme.md).

For more details, please refer to [ethers.js documentation](https://docs.ethers.org/v6/api/contract/#ContractEvent).

This is a message in Chinese about Solidity events. Here is a possible translation to English:

## Event

Events emitted by smart contracts are stored in the logs of the Ethereum Virtual Machine. Logs are divided into two parts: `topics` and `data`. The event hash and `indexed` variables are stored in `topics`, which are indexed for easy searching later. Non-`indexed` variables are stored in `data`, which cannot be directly retrieved, but can store more complex data structures.

For example, the `Transfer` event in ERC20 tokens is declared like this in the contract:

```solidity
event Transfer(address indexed from, address indexed to, uint256 amount);
```

It records three variables: `from`, `to`, and `amount`, which correspond to the token's sender address, receiver address, and transfer amount, respectively. The `from` and `to` variables are preceded by the `indexed` keyword. When transferring tokens, the `Transfer` event is recorded and can be [found](https://rinkeby.etherscan.io/tx/0x8cf87215b23055896d93004112bbd8ab754f081b4491cb48c37592ca8f8a36c7) on `etherscan`.

![Transfer event](img/7-1.png)

From the above figure, you can see that the `Transfer` event is recorded in the EVM log, where `Topics` contains three data, corresponding to the event hash, sender address `from`, and receiver address `to`; while `Data` contains one data, corresponding to the transfer amount `amount`.

## Retrieving Events

We can use the contract type's `queryFilter()` function in `Ethers` to read events emitted by contracts.

```js
const transferEvents = await contract.queryFilter('event name', start block, end block)
```

`queryFilter()` has three parameters: event name (required), start block (optional), and end block (optional). The retrieval result will be returned as an array.

**Note**: The event to be retrieved must be included in the contract's `abi`.

## Example: Retrieve `Transfer` Events from the `WETH` Contract

1. Create a `provider`.
    ```js
    import { ethers } from "ethers";
    // Connect to the Ethereum network using Alchemy's rpc node
    // To prepare alchemy API you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
    const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
    ```
