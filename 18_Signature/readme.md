

# Ethers Getting Started: 18. Digital Signature Script

I've been relearning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers Getting Started` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community**: [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lecture, we introduce a method of using off-chain signatures as a whitelist to distribute `NFTs`. If you are not familiar with the `ECDSA` contract, please see [WTF Solidity Getting Started Lecture 37: Digital Signature](https://github.com/AmazingAng/WTF-Solidity/blob/main/37_Signature/readme.md).

## Digital Signature

If you have used `opensea` to trade `NFTs`, you will not be unfamiliar with signatures. The following picture is the window that pops up when the little fox (`metamask`) wallet performs a signature. It can prove that you own the private key without revealing it to the public.
