
---
title: 14. Batch generate wallets
---

# Ethers Quick Start: 14. Batch generate wallets

I've been re-learning `ethers.js` recently, to solidify some details, and also write a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lecture, we will introduce HD wallets and write a script to generate multiple wallets.

## HD wallet

HD wallet (Hierarchical Deterministic Wallet) is a type of digital wallet that is usually used to store digital keys for holders of cryptocurrencies such as Bitcoin and Ethereum. Through it, users can create a series of key pairs from a random seed, which is more convenient, secure, and private. To understand HD wallets, we need to briefly understand Bitcoin's [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki), [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki), and [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).

### BIP32

Before `BIP32` was introduced, users had to keep track of a bunch of private keys to manage multiple wallets. `BIP32` proposed that multiple private keys can be derived from a random seed, making it easier to manage multiple wallets. The wallet address is determined by the derivation path, such as `"m/0/0/1"`.

### BIP44

`BIP44` provides a set of common specifications for `BIP32`'s derivation path, compatible with multiple chains such as Bitcoin and Ethereum. This set of specifications contains six levels, separated by "/":
```
m / purpose' / coin_type' / account' / change / address_index
```
Where:
- m: fixed as "m"
- purpose: fixed as "44"
- coin_type: token type, Bitcoin mainnet is 0, Bitcoin testnet is 1, Ethereum mainnet is 60
- account: account index, starting from 0.
- change: whether it is an external chain, 0 for external chain, 1 for internal chain, usually fill in 0.
- address_index: address index, starting from 0, want to generate a new address just change this to 1, 2, 3.

For example, the default derivation path for Ethereum is `"m/44'/60'/0'/0/0"`.

### BIP39

`BIP39` allows users to keep their private keys in a way that is memorable to humans with mnemonic words, rather than a string of hexadecimal numbers:

```
//private key
0x813f8f0a4df26f6455814fdd07dd2ab2d0e2d13f4d2f3c66e7fd9e3856060f89
//mnemonic words
air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt
```

## Batch generate wallets

`ethers.js` provides the [HDNode class](https://docs.ethers.org/v6-beta/api/wallet/#HDNodeWallet), which makes it easy for developers to use HD wallets. Below we use it to generate 20 wallets from a mnemonic phrase.

1. Create an `HDNode` wallet variable, you can see that the mnemonic phrase is `'air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt'`
    ```js
    // Generate a random mnemonic phrase
    const mnemonic = ethers.Mnemonic.entropyToPhrase(randomBytes(32))
    // Create an HD wallet from the phrase
    const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
    console.log(hdNode);
    ```
  
2. Derive 20 wallets from the HD wallet.

    ```js
    const numWallet = 20
    // Derivation path: m / purpose' / coin_type' / account' / change / address_index
    // We only need to switch the last address_index, to derive new wallets from hdNode
    let basePath = "m/44'/60'/0'/0";
    let wallets = [];
    for (let i = 0; i < numWallet; i++) {
        let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
        let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
        console.log(`The ${i+1}th wallet address: ${walletNew.address}`)
        wallets.push(walletNew);
    }
    ```
3. Save the wallet as encrypted json:

    ```js
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    console.log("Create a wallet from the mnemonic phrase:")
    console.log(wallet)
    // The password for encrypting the json, can be changed to something else
    const pwd = "password"
    const json = await wallet.encrypt(pwd)
    console.log("The encrypted json of the wallet:")
    console.log(json)
    ```
4. Load the wallet from the encrypted json:
    ```js
    const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
    console.log("\n4. Load the wallet from the encrypted json:")
    console.log(wallet2)
    ```
## Summary
In this lecture, we introduced HD wallets (BIP32, BIP44, BIP39), and used them to batch generate 20 wallets with `ethers.js`.
