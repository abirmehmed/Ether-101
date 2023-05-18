
---
title: 10. BigNumber and Unit Conversion
---

# Ethers Quick Start: 10. BigNumber and Unit Conversion

I've been re-learning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

Tip: This tutorial is based on ethers.js 6.3.0, if you are using v5, you can refer to [ethers.js v5 documentation](https://docs.ethers.io/v5/).

In this lesson, we introduce the `BigNumber` class and unit conversion.

## `BigInt`

In Ethereum, many calculations exceed the safe value of JavaScript integers (the maximum safe integer in js is `9007199254740991`). Therefore, `ethers.js` uses the native `BigInt` class of JavaScript ES2020 version to safely perform mathematical operations on numbers of any magnitude. In `ethers.js`, most operations that require returning values will return `BigInt`, and parameters that accept values will also accept them.

### Create `BigInt` instance

You can use the `ethers.getBigInt()` function to convert types such as `string`, `number`, etc. to `BigInt`.

**Note** that numbers exceeding the maximum safe integer in js will not be converted.

```js
const oneGwei = ethers.getBigInt("1000000000"); // generate from decimal string
console.log(oneGwei)
console.log(ethers.getBigInt("0x3b9aca00")) // generate from hex string
console.log(ethers.getBigInt(1000000000)) // generate from number
// Cannot generate BigNumber from numbers outside of js's largest safe integer, the following code will throw an error
// ethers.getBigInt(Number.MAX_SAFE_INTEGER);
console.log("Maximum safe integer in js：", Number.MAX_SAFE_INTEGER)
```
