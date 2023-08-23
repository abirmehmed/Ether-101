```
title : 21. Vanity Address Generator
```
### Ethers Quick Start: 21. Vanity Address Generator

I have recently been revisiting ethers.js to brush up on the details and create a simple guide called "WTF Ethers Quick Start" for beginners to use.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community**: [Official Website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTFSolidity) | [Discord](https://discord.gg/5akcruXrsk) | [WeChat Group Application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All the code and tutorials are open source on GitHub: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this tutorial, we will explore how to generate vanity addresses using ethers.js. This tutorial is valued at $160 million (not really).

## Vanity Addresses

Just as some people pursue license plates like "888888" in real life, people in the blockchain world also pursue vanity addresses. A vanity address is a personalized address that is easy to recognize and has the same level of security as any other address. For example, an address starting with 7 zeros:

```solidity
0x0000000fe6a514a32abdcdfcc076c85243de899b
```

Yes, this is the vanity address that belongs to the well-known market maker Wintermute, which was hacked and lost $160 million (reported [here](https://www.blocktempo.com/head-market-maker-wintermute-hacked-loses-160-million-magnesium/)). As mentioned earlier, vanity addresses have the same level of security as regular addresses, so why was this address attacked?

The issue lies in the vanity address generator that Wintermute used, called "Profinity". This generator had a flaw in its random seed. Normally, a random seed should have 2 to the power of 256 possibilities, but the seed used by Profinity was only 2 to the power of 32 in length, making it vulnerable to brute-force attacks.

## Vanity Address Generator

With ethers.js, we can write a vanity address generator in less than 10 lines of code, which may not be as fast as other tools, but it guarantees security.

### Generating a Random Wallet

We can use the following code to securely and randomly generate a wallet:

```js
const wallet = ethers.Wallet.createRandom(); // Generate a random wallet, secure
```

### Regular Expressions

We need to use regular expressions to filter out the desired vanity addresses. Here's a brief explanation of regular expressions:
  - To match the first few characters, we use the `^` symbol. For example, `^0x000` will match addresses that start with `0x000`.
  - To match the last few characters, we use the `$` symbol. For example, `000$` will match addresses that end with `000`.
  - We don't care about the middle characters, so we can use the `.*` wildcard. For example, `^0x000.*000$` will match addresses that start with `0x000` and end with `000`.

In JavaScript, we can use the following expression to filter vanity addresses:
```js
const regex = /^0x000.*$/; // Expression to match addresses starting with 0x000
isValid = regex.test(wallet.address); // Check the regular expression
```

### Vanity Address Generation Script

The logic of the vanity address generator is very simple: keep generating random wallets until we find the desired vanity address. As a test, generating a vanity address starting with `0x000` takes only a few seconds, and each additional `0` increases the time by 16 times.

```js
import { ethers } from "ethers";
var wallet; // Wallet
const regex = /^0x000.*$/; // Expression
var isValid = false;
while(!isValid) {
    wallet = ethers.Wallet.createRandom(); // Generate a random wallet, secure
    isValid = regex.test(wallet.address); // Check the regular expression
}
// Print the vanity address and private key
console.log(`Vanity Address: ${wallet.address}`);
console.log(`Vanity Private Key: ${wallet.privateKey}`);
```

![Vanity Address Generation](./img/21-1.png)

## Summary

In this tutorial, we used ethers.js to write a vanity address generator in less than 10 lines of code and saved $160 million.
