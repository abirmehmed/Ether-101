import { ethers } from "ethers";

// Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

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

// ERC721 interface's ERC165 identifier
const selectorERC721 = "0x80ac58cd"

const main = async () => {
    try {
    // 1. Read the chain information of the ERC721 contract
    const nameERC721 = await contractERC721.name()
    const symbolERC721 = await contractERC721.symbol()
    console.log("\n1. Read the ERC721 contract information")
    console.log(`Contract address: ${addressBAYC}`)
    console.log(`Name: ${nameERC721}`)
    console.log(`Symbol: ${symbolERC721}`)

    // 2. Use ERC165's supportsInterface to determine if the contract is an ERC721 standard
    const isERC721 = await contractERC721.supportsInterface(selectorERC721)
    console.log("\n2. Use ERC165's supportsInterface to determine if the contract is an ERC721 standard")
    console.log(`Is the contract an ERC721 standard: ${isERC721}`)
    }catch (e) {
        // If it is not ERC721, it will report an error
        console.log(e);
    }
}

main()
