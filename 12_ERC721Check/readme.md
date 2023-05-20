Here is the translated readme.md in English:

---
title: 12. Identify ERC721 contract
---

# Ethers Quick Start: 12. Identify ERC721 contract

I've been re-learning `ethers.js` lately, consolidating some details, and also writing a `WTF Ethers Quick Start` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community:** [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTFSolidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTFEthers)

-----



## `ERC721`

`ERC721` is a popular non-fungible token (NFT) standard on Ethereum. If you are not familiar with this standard, you can read [WTF Solidity Lecture 34 ERC721](https://github.com/AmazingAng/WTFSolidity/blob/main/34_ERC721/readme.md). When making NFT-related products, we need to filter out contracts that conform to the `ERC721` standard. For example, Opensea, it will automatically identify `ERC721`, and crawl down its name, symbol, metadata and other data for display. To identify `ERC721`, we first need to understand `ERC165`.

## `ERC165`

Through the [ERC165 standard](https://eips.ethereum.org/EIPS/eip-165), smart contracts can declare the interfaces they support for other contracts to check. Therefore, we can use `ERC165` to check whether a smart contract supports the `ERC721` interface.

The `IERC165` interface contract only declares a `supportsInterface` function, which takes the queried `interfaceId` interface id (type `bytes4`) as input. If the contract implements the interface id, it returns `true`; otherwise, it returns `false`:

```solidity
interface IERC165 {
    /**
     * @dev If the contract implements the queried `interfaceId`, return true
     * Rules see: https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     *
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
```

The `ERC721` contract will implement the `supportsInterface` function of the `IERC165` interface contract, and return `true` when querying `0x80ac58cd` (`ERC721` interface id).
```solidity
   function supportsInterface(bytes4 interfaceId)
        external
        pure
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC721).interfaceId 
    }
```

## Identify `ERC721`

1. Create a `provider` and connect to the Ethereum mainnet.
    ```js
    // Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
    const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_MAINNET_URL);
    ```

2. Create an `ERC721` contract instance. In the `abi` interface, we declare the `name()`, `symbol()`, and `supportsInterface()` functions that we want to use. Here we use BAYC's contract address.
    ```js
    // Contract abi
    const abiERC721 = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function supportsInterface(bytes4) public view returns(bool)",
    ];
    // ERC721 contract address, here we use BAYC
    const addressBAYC = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
    // Create ERC721 contract instance
    const contractERC721 = new ethers.Contract(addressBAYC, abiERC721, provider)
    ```

3. Read the chain information of the contract: name and symbol.
    ```js
    // 1. Read the chain information of the ERC721 contract
    const nameERC721 = await contractERC721.name()
    const symbolERC721 = await contractERC721.symbol()
    console.log("\n1. Read the ERC721 contract information")
    console.log(`Contract address: ${addressBAYC}`)
    console.log(`Name: ${nameERC721}`)
    console.log(`Symbol: ${symbolERC721}`)
    ```

