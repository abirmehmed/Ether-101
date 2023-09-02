import { ethers } from "ethers";

// 1. Prepare Alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md for more information
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 2. Contract addresses
// DAI address (mainnet)
const daiAddr = "0x6b175474e89094c44da98b954eedeac495271d0f"
// BAYC address (mainnet)
const baycAddr = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"

// 3. Check function, checks if an address is an ERC20 contract
async function erc20Checker(addr){
    // Get the contract bytecode
    let code = await provider.getCode(addr)
    // Non-contract addresses have bytecode of "0x"
    if(code != "0x"){
        // Check if the bytecode contains the selector for the transfer and totalSupply functions
        if(code.includes("a9059cbb") && code.includes("18160ddd")){
            // If it does, it is an ERC20 contract
            return true
        }else{
            // If it doesn't, it is not an ERC20 contract
            return false
        }
    }else{
        return null;
    }

}

const main = async () => {
    // Check if DAI contract is an ERC20 contract
    let isDaiERC20 = await erc20Checker(daiAddr)
    console.log(`1. Is DAI an ERC20 contract: ${isDaiERC20}`)

    // Check if BAYC contract is an ERC20 contract
    let isBaycERC20 = await erc20Checker(baycAddr)
    console.log(`2. Is BAYC an ERC20 contract: ${isBaycERC20}`)
}

main()
