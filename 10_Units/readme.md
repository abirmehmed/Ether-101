
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

### `BigInt` operations

`BigInt` supports many operations, such as addition, subtraction, multiplication, division, modulo `mod`, power `pow`, absolute value `abs`, etc.:
> Note: Values with suffix `n` will be automatically converted to `BigInt`

```js
// operations
console.log("Addition：", oneGwei + 1n)
console.log("Subtraction：", oneGwei - 1n)
console.log("Multiplication：", oneGwei * 2n)
console.log("Division：", oneGwei / 2n)
// comparison
console.log("Are they equal：", oneGwei == 1000000000n)
```
## Unit conversion

In Ethereum, `1 ether` is equal to `10^18 wei`. Here are some common units:

In applications, we often convert values between user-readable strings (in `ether` units) and machine-readable values (in `wei` units). For example, wallets can specify balances (in `ether` units) and `gas` prices (in `gwei` units) for the user interface, but when sending transactions, both must be converted to values in `wei` units. `ethers.js` provides some utility functions to facilitate this type of conversion.

- `formatUnits(value, unit)`: Formatting, small unit to large unit, such as `wei` -> `ether`, useful for displaying balances. In the parameters, the unit is filled with digits (numbers) or specified units (strings).

    ```js
    //code reference: https://docs.ethers.org/v6/api/utils/#about-units
    console.group('\n2. Formatting: small unit to large unit, formatUnits');
    console.log(ethers.formatUnits(oneGwei, 0));
    // '1000000000'
    console.log(ethers.formatUnits(oneGwei, "gwei"));
    // '1.0'
    console.log(ethers.formatUnits(oneGwei, 9));
    // '1.0'
    console.log(ethers.formatUnits(oneGwei, "ether"));
    // `0.000000001`
    console.log(ethers.formatUnits(1000000000, "gwei"));
    // '1.0'
    console.log(ethers.formatEther(oneGwei));
    // `0.000000001` equivalent to formatUnits(value, "ether")
    console.groupEnd();
    ```
- `parseUnits(value, unit)`: Parsing, large unit to small unit, such as `ether` -> `wei`, useful for converting user input values to values in `wei` units. In the parameters, the unit is filled with digits (numbers) or specified units (strings).
```js
   // 3. Parsing: large unit to small unit
   // For example, convert ether to wei: parseUnits(value, unit), parseUnits default unit is ether
   // Code reference: https://docs.ethers.org/v6/api/utils/#about-units
   console.group('\n3. Parsing: large unit to small unit, parseUnits');
   console.log(ethers.parseUnits("1.0").toString());
   // { BigNumber: "1000000000000000000" }
   console.log(ethers.parseUnits("1.0", "ether").toString());
   // { BigNumber: "1000000000000000000" }
   console.log(ethers.parseUnits("1.0", 18).toString());
   // { BigNumber: "1000000000000000000" }
   console.log(ethers.parseUnits("1.0", "gwei").toString());
   // { BigNumber: "1000000000" }
   console.log(ethers.parseUnits("1.0", 9).toString());
   // { BigNumber: "1000000000" }
   console.log(ethers.parseEther("1.0").toString());
   // { BigNumber: "1000000000000000000" } equivalent to parseUnits(value, "ether")
   console.groupEnd();
   ```


## Summary

In this lesson, we introduced the `BigNumber` class, the common units in Ethereum, and unit conversion.

