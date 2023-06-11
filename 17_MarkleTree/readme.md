---
title: 17. MerkleTree script
---

# Ethers minimalist entry: 17. MerkleTree script

I'm re-learning `ethers.js` recently, consolidating the details, and writing a `WTF Ethers Minimalist Introduction` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord]( https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All codes and tutorials are open source on github: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lecture, we will write a script that utilizes the `Merkle Tree` whitelist to cast `NFT`. If you are not familiar with the `Merkle Tree` contract, please see [WTF Solidity Minimalist Lecture 37: Merkle Tree](https:/ /github.com/AmazingAng/WTF-Solidity/blob/main/36_MerkleTree/readme.md).

## Merkle Tree
`Merkle Tree`, also called Merkle tree or hash tree, is the underlying encryption technology of the blockchain and is widely used by the Bitcoin and Ethereum blockchains. `Merkle Tree` is a bottom-up encrypted tree, each leaf is the hash of the corresponding data, and each non-leaf is the hash of its `2` child nodes.

`Merkle Tree` allows efficient and secure verification of the contents of large data structures (`Merkle Proof`). For a `Merkle Tree` with `N` leaf nodes, when the root value of `root` is known, verifying whether a certain data is valid (belonging to `Merkle Tree` leaf nodes) only needs `log(N) `A data (also called `proof`), very efficient. If the data is wrong, or the `proof` given is wrong, the `root` rooting cannot be restored. In the following example, the `Merkle proof` of leaf `L1` is `Hash 0-1` and `Hash 1`: Knowing these two values, you can verify whether the value of `L1` is in the leaf of `Merkle Tree` middle.

