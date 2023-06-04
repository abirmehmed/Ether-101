
// The process of distributing NFT whitelists through signatures:
//    
//    Keep the signer wallet's private-public key pair on the server
// -> Record the allowlist (whitelist addresses) and tokenId on the server and generate the corresponding msgHash,
// -> Use the signer wallet to sign the msgHash
// -> Deploy the NFT contract, and save the public key of the signer in the contract during initialization.
// -> When users mint, they fill in their address and tokenId and request a signature from the server.
// -> Call the contract's mint() function to mint

import { ethers } from "ethers";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. Create a provider and wallet
// Prepare the alchemy API. You can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// Create a wallet object using the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 2. Generate msgHash based on allowlist address and tokenId, and sign it
console.log("\n1. Generate signature")
// Create a message
const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const tokenId = "0"
// Equivalent to keccak256(abi.encodePacked(account, tokenId)) in Solidity
const msgHash = ethers.solidityPackedKeccak256(
    ['address', 'uint256'],
    [account, tokenId])
console.log(`msgHash：${msgHash}`)

const main = async () => {
    // Sign the message
    const messageHashBytes = ethers.getBytes(msgHash)
    const signature = await wallet.signMessage(messageHashBytes);
    console.log(`Signature：${signature}`)

    // 3. Create a contract factory
    // Human-readable ABI for the NFT
    const abiNFT = [
        "constructor(string memory _name, string memory _symbol, address _signer)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function mint(address _account, uint256 _tokenId, bytes memory _signature) external",
        "function ownerOf(uint256) view returns (address)",
        "function balanceOf(address) view returns (uint256)",
    ];
  
