---
title: 9. Event Filtering
---

# Ethers.js Quick Start: 9. Event Filtering

I've been relearning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers.js Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTFEthers)

-----

Based on the previous lecture [Ethers.js Quick Start: 8. Contract Listening](https://github.com/WTFAcademy/WTFEthers/tree/main/08_ContractListener), we extend it a bit and add filters to the listening process to listen to transfers in and out of specific addresses.

You can refer to [ethers.js documentation](https://docs.ethers.io/v5/concepts/events) for more details.

## Filters

When a contract creates a log (emits an event), it can include up to [4] pieces of data as indexed (`indexed`). Indexed data is hashed and included in a [Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter), which is a data structure that allows efficient filtering. Therefore, an event filter can have up to `4` topic sets, each of which is a condition for filtering the target event. The rules are:

- If a topic set is `null`, then the log topic at that position is not filtered, and any value matches.
- If the topic set is a single value, then the log topic at that position must match that value.
- If the topic set is an array, then the log topic at that position must match at least one of the values in the array.

## Creating filters
The contract class in `ethers.js` provides `contract.filters` to simplify the creation of filters:

```js
const filter = contract.filters.EVENT_NAME( ...args ) 
```

Where `EVENT_NAME` is the name of the event to filter, and `..args` are the topic sets/conditions. The rules above are a bit abstract, so here are a few examples.

1. Filter `Transfer` events from `myAddress`
  ```js
  contract.filters.Transfer(myAddress)
  ```

2. Filter all `Transfer` events sent to `myAddress`
  ```js
  contract.filters.Transfer(null, myAddress)
  ```

3. Filter all `Transfer` events from `myAddress` to `otherAddress`
  ```js
  contract.filters.Transfer(myAddress, otherAddress)
  ```

4. Filter all `Transfer` events sent to either `myAddress` or `otherAddress`
  ```js
  contract.filters.Transfer(null, [ myAddress, otherAddress ])
  ```

## Listening to USDT transfers from the exchange


1. Transactions that transfer USDT out of Binance exchange

  Before listening to the USDT contract, we need to understand the transaction logs `Logs`, including the event's `topics` and `data`. We first find a transaction that transfers USDT out of Binance exchange, and then look up its details on etherscan using the hash:

  Transaction hash: [0xab1f7b575600c4517a2e479e46e3af98a95ee84dd3f46824e02ff4618523fff5](https://etherscan.io/tx/0xab1f7b575600c4517a2e479e46e3af98a95ee84dd3f46824e02ff4618523fff5)

  ![etherscan illustration](img/9-2.png)

  The transaction did one thing: transferred `2983.98` USDT from `binance14` (Binance hot wallet) to address `0x354de44bedba213d612e92d3248b899de17b0c58`.

  Check the event log `Logs` information:
