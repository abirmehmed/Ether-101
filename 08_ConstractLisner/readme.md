---
title: 8. Listening to contract events
---

# Ethers.js Quick Start: 8. Listening to contract events

I've been relearning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers.js Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

Tip: This tutorial is based on ethers.js 6.3.0, if you are using v5, you can refer to [ethers.js v5 documentation](https://docs.ethers.io/v5/).

In this lecture, we will introduce how to listen to contracts and implement listening to the `Transfer` event of the USDT contract.

You can refer to [ethers.js documentation](https://docs.ethers.org/v6/api/contract/#ContractEvent) for more details.

## Listening to contract events

### `contract.on`
In `ethersjs`, the contract object has a `contract.on` listening method that allows us to continuously listen to the events emitted by the contract:

```js
contract.on("eventName", function)
```
`contract.on` has two parameters, one is the name of the event to listen to `"eventName"`, which needs to be included in the contract `abi`; the other is the function we call when the event occurs.

### contract.once

The contract object has a `contract.once` listening method that allows us to listen only once to the event emitted by the contract, its parameters are the same as `contract.on`:

```js
contract.once("eventName", function)
```

## Listening to `USDT` contract

4. Use the `contract.on()` function to continuously listen to the `Transfer` event and print the result.
  ```js
    // Keep listening to USDT contract
    console.log("\n2. Use contract.on() to keep listening to the Transfer event");
    contractUSDT.on('Transfer', (from, to, value)=>{
      console.log(
       // Print result
       `${from} -> ${to} ${ethers.formatUnits(ethers.getBigInt(value),6)}`
      )
    })
  ```
## Summary
In this lecture, we introduced the simplest on-chain listening functionality in `ethers`, `contract.on()` and `contract.once()`. With these methods, you can listen to specific events of a specific contract.
