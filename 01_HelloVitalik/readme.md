

# Ethers.js Example

This is a simple example of how to use [ethers.js](https://docs.ethers.io/v6/) library to interact with the Ethereum network. Ethers.js is a lightweight and modular library for working with Ethereum smart contracts, wallets, providers and more.

## What does this code do?

This code uses ethers.js to connect to the Ethereum mainnet using an [Alchemy](https://www.alchemy.com/) provider. Alchemy is a service that provides fast and reliable access to Ethereum nodes. You need to create an account and get an API key to use Alchemy.

The code then queries the ETH balance of the address `vitalik.eth`, which is an [Ethereum Name Service (ENS)](https://ens.domains/) domain that resolves to the address of Vitalik Buterin, the co-founder of Ethereum. ENS is a decentralized naming system that allows users to have human-readable names for their Ethereum addresses.

The code then outputs the balance in the console using `ethers.formatEther` function, which converts the balance from wei (the smallest unit of ETH) to ether (the standard unit of ETH).

## How to run this code?

To run this code, you need to have [Node.js](https://nodejs.org/en/) installed on your machine. Node.js is a runtime environment that allows you to run JavaScript code outside of a browser.

You also need to install ethers.js library using [npm](https://www.npmjs.com/), which is a package manager for Node.js. You can install ethers.js by running this command in your terminal:

```bash
npm install ethers
```

Alternatively, you can use a free online editor like [playcode.io](https://playcode.io/) or [replit.com](https://replit.com/) that allows you to run JavaScript code in your browser. However, you need to import ethers.js library from a CDN (content delivery network) link instead of installing it locally. You can use this link:

```javascript
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.2.3/ethers.js";
```

You also need to replace the Alchemy mainnet URL with your own API key. You can get one by creating an account on [Alchemy](https://www.alchemy.com/) and following their instructions.

Once you have everything set up, you can run the code by typing this command in your terminal or clicking the run button on the online editor:

```bash
node index.js
```

You should see something like this in your console:

```bash
ETH Balance of vitalik: 333.333333333333333333 ETH
```
