# Ethers Quick Start: Recognizing ERC20 Contracts

I have recently been relearning `ethers.js` to solidify my understanding of its details and to create a simplified guide called "WTF Ethers Quick Start" for beginners to use.

Twitter: [@0xAA_Science](https://twitter.com/0xAA_Science) | [@WTFAcademy_](https://twitter.com/WTFAcademy_)

WTF Academy Community: [Discord](https://discord.gg/5akcruXrsk) | [WeChat Group](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link) | [Official Website wtf.academy](https://wtf.academy)

All the code and tutorials are open source on GitHub: [github.com/WTFAcademy/WTFEthers](https://github.com/WTFAcademy/WTF-Ethers)

---

In this lesson, we will learn how to use `ethers.js` to identify whether a contract conforms to the `ERC20` standard. You will use this knowledge in scenarios such as on-chain analysis, identifying tokens, and participating in token launches.

## `ERC20`

`ERC721` is the most commonly used token standard on Ethereum. If you are not familiar with this standard, you can read [WTF Solidity Lesson 31: ERC20](https://github.com/AmazingAng/WTF-Solidity/blob/main/31_ERC20/readme.md). The `ERC20` standard includes the following functions and events:
```solidity
interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
```

## Recognizing ERC20 Contracts
In a previous tutorial, we explained how to identify `ERC721` contracts based on `ERC165`. However, since `ERC20` was released earlier than `ERC165` (20 < 165), we cannot use the same method to identify `ERC20` contracts. Instead, we need to find another solution.

Since the blockchain is transparent, we can obtain the bytecode of any contract address. Therefore, we can first retrieve the bytecode of the contract and then check if it contains the functions defined in the `ERC20` standard.

First, we use the `getCode()` function of the provider to retrieve the bytecode of the corresponding address:
```js
let code = await provider.getCode(contractAddress);
```

Next, we need to check if the contract's bytecode contains the function selectors from the `ERC20` standard. The bytecode of the contract contains the corresponding [function selectors]: if the contract contains the `transfer(address, uint256)` function, the bytecode will include `a9059cbb`; if the contract contains `totalSupply()`, the bytecode will include `18160ddd`. If you are not familiar with function selectors, you can read the corresponding section in WTF Solidity's [documentation](https://github.com/AmazingAng/WTF-Solidity/blob/main/29_Selector/readme.md). If you want to dive deeper into bytecode, you can read [Dive into the EVM](https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Translation/DiveEVM2017).

Here, we only need to check two functions: `transfer(address, uint256)` and `totalSupply()`. We don't need to check all six functions because:
1. `transfer(address, uint256)` is the only function in the `ERC20` standard that is not included in the `ERC721`, `ERC1155`, and `ERC777` standards. Therefore, if a contract contains the `transfer(address, uint256)` selector, we can determine that it is an `ERC20` token contract and not any other type.
2. Additional checking of `totalSupply()` is to prevent [selector collisions](https://github.com/AmazingAng/WTFSolidity/blob/main/S01_ReentrancyAttack/readme.md): a random bytecode could be the same as the selector for `transfer(address, uint256)` (4 bytes).

Here is the code:
```js
async function erc20Checker(addr){
    // Get the contract bytecode
    let code = await provider.getCode(addr);
    // If the bytecode of the contract address is not "0x", it means it is a contract
    if(code != "0x"){
        // Check if the bytecode contains the selectors for the transfer function and totalSupply function
        if(code.includes("a9059cbb") && code.includes("18160ddd")){
            // If it does, it is an ERC20 contract
            return true;
        }else{
            // If it doesn't, it is not an ERC20 contract
            return false;
        }
    }else{
        return null;
    }
}
```

## Testing Script

To test if the script can correctly identify ERC20 contracts, we will use the `DAI` (ERC20) and `BAYC` (ERC721) contracts.

```js
// DAI address (mainnet)
const daiAddr = "0x6b175474e89094c44da98b954eedeac495271d0f";
// BAYC address (mainnet)
const baycAddr = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

const main = async () => {
    // Check if the DAI contract is an ERC20 contract
    let isDaiERC20 = await erc20Checker(daiAddr);
    console.log(`1. Is DAI an ERC20 contract: ${isDaiERC20}`);

    // Check if the BAYC contract is an ERC20 contract
    let isBaycERC20 = await erc20Checker(baycAddr);
    console.log(`2. Is BAYC an ERC20 contract: ${isBaycERC20}`);
};

main();
```

The output will be as follows:

![](./img/24-1.png)

The script successfully detects that the `DAI` contract is an `ERC20` contract, while the `BAYC` contract is not an `ERC20` contract.

## Summary

In this lesson, we learned how to retrieve the bytecode of a contract using its address and how to use function selectors to check if a contract conforms to the `ERC20` standard. The script successfully identified the `DAI` contract as an `ERC20` contract and the `BAYC` contract as not an `ERC20` contract. How will you use this knowledge in your own scenarios?
