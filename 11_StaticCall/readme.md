
---
title: 11. StaticCall
---

# Ethers Quick Start: 11. StaticCall

I've been re-learning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTFEthers)

-----

In this lesson, we introduce the `staticCall` method of the contract class, which checks whether a transaction will fail before sending it, saving a lot of gas.

The `staticCall` method is a writing method analysis belonging to the ```ethers.Contract``` class. Similar methods are `populateTransaction` and `estimateGas`.

## Transactions that may fail

Sending transactions on Ethereum requires paying expensive `gas`, and there is a risk of failure. Sending failed transactions will not return your `gas` to you. Therefore, knowing which transactions may fail before sending them is very important. If you have used the `metamask` fox wallet, you will not be unfamiliar with the picture below.

Source: Conversation with Bing, 5/18/2023
(1) Markdown Translator: Multilingual Documentations in Seconds - simpleen. https://simpleen.io/blog/translate-markdown-files.
(2) Translate and convert Markdown files - GroupDocs. https://products.groupdocs.app/translation/markdown.
(3) Translate markdown format - simpleen. https://simpleen.io/translate-markdown.
