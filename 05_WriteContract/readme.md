
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
