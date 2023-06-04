
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

    // Contract bytecode. In Remix, you can find the bytecode in two places:
    // i. The Bytecode button in the deployment panel
    // ii. The json file with the same name as the contract in the artifact folder in the file panel
    // The data corresponding to the "object" field is the bytecode. It's quite long and starts with 608060.
    // "object": "608060405260646000553480156100...
    const bytecodeNFT = contractJson.default.object;
    const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

    // Check the ETH balance in the wallet
    const balanceETH = await provider.getBalance(wallet)

    // If the wallet has enough ETH
    if(ethers.formatEther(balanceETH) > 0.002){
        // 4. Deploy the NFT contract using contractFactory
        console.log("\n2. Deploy the NFT contract using contractFactory")
        // Deploy the contract and fill in the constructor parameters
        const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
        console.log(`Contract address: ${contractNFT.target}`);
        console.log("Waiting for contract deployment on-chain")
        await contractNFT.waitForDeployment()
        // You can also use contractNFT.deployTransaction.wait()
        console.log("Contract is on-chain")

        // 5. Call the mint() function, use signature verification to whitelist and mint NFT for account address
        console.log("\n3. Call the mint() function, use signature verification to whitelist and mint NFT for first address")
        console.log(`NFT name: ${await contractNFT.name()}`)
        console.log(`NFT symbol: ${await contractNFT.symbol()}`)
        let tx = await contractNFT.mint(account, tokenId, signature)
        console.log("Minting in progress, waiting for transaction on-chain")
        await tx.wait()
        console.log(`Mint successful, NFT balance of address ${account}: ${await contractNFT.balanceOf(account)}\n`)

    }else{
        // If there is not enough ETH
        console.log("Not enough ETH, go to a faucet to get some Goerli ETH")
        console.log("1. Chainlink faucet: https://faucets.chain.link/goerli")
        console.log("2. Paradigm faucet: https://faucet.paradigm.xyz/")
    }
}

main()
