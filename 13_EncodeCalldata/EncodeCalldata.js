// Interface class
// Generate using abi
// const interface = ethers.Interface(abi)
// Get directly from contract
// const interface2 = contract.interface
import { ethers } from "ethers";

// Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// Create wallet object using private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b'
const wallet = new ethers.Wallet(privateKey, provider)

// WETH's ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function deposit() public payable",
];
// WETH contract address (Goerli testnet)
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'

// Declare WETH contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)

