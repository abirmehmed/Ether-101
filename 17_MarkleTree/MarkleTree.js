import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import * as contractJson from "./contract.json" assert {type: "json"};

// 1. Generate merkle tree
console.log("\n1. Generate merkle tree")
// whitelist address
const tokens = [
     "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
     "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
     "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
     "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];
// leaf, merkletree, proof
const leaf = tokens. map(x => ethers. keccak256(x))
const merkletree = new MerkleTree(leaf, ethers.keccak256, { sortPairs: true });
const proof = merkletree. getHexProof(leaf[0]);
const root = merkletree. getHexRoot()
console.log("Leaf:")
console. log(leaf)
console.log("\nMerkleTree:")
console. log(merkletree. toString())
console.log("\nProof:")
console. log(proof)
console.log("\nRoot:")
console. log(root)

// 2. Create provider and wallet
// Prepare alchemy API, please refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
// Create wallet object with private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers. Wallet(privateKey, provider)

// 3. Create a contract factory
// Human readable abi of NFT
const abiNFT = [
     "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
     "function name() view returns (string)",
     "function symbol() view returns (string)",
     "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
     "function ownerOf(uint256) view returns (address)",
     "function balanceOf(address) view returns (uint256)",
];
// Contract bytecode, in remix, you can find Bytecode in two places
// i. Bytecode button of the deployment panel
// ii. In the json file with the same name as the contract under the artifact folder of the file panel
// The data corresponding to the "object" field in it is Bytecode, which is quite long, starting from 608060
// "object": "608060405260646000553480156100...
const bytecodeNFT = contractJson.default.object;
const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

const main = async () => {
     // Read the ETH balance in the wallet
     const balanceETH = await provider. getBalance(wallet)

     // If the wallet ETH is enough
     if(ethers. formatEther(balanceETH) > 0.002){
         // 4. Use contractFactory to deploy NFT contracts
         console.log("\n2. Use contractFactory to deploy NFT contract")
         // Deploy the contract and fill in the parameters of the constructor
         const contractNFT = await factoryNFT.deploy("WTF Merkle Tree", "WTF", root)
         console.log(`Contract address: ${contractNFT.target}`);
         console.log("Waiting for the contract to be deployed on the chain")
         await contractNFT.waitForDeployment()
         // You can also use contractNFT.deployTransaction.wait()
         console.log("The contract has been uploaded")

         // 5. Call the mint() function, use the merkle tree to verify the whitelist, and cast an NFT for the 0th address
         console.log("\n3. Call the mint() function, use the merkle tree to verify the whitelist, and cast an NFT for the first address")
         console.log(`NFT name: ${await contractNFT.name()}`)
         console.log(`NFT symbol: ${await contractNFT.symbol()}`)
         let tx = await contractNFT.mint(tokens[0], "0", proof)
         console.log("Casting, waiting for the transaction to be uploaded")
         await tx. wait()
         console.log(`mint succeeded, NFT balance of address ${tokens[0]}: ${await contractNFT.balanceOf(tokens[0])}\n`)

     }else{
         // If ETH is insufficient
         console.log("ETH is insufficient, go to the faucet to get some Goerli ETH")
         console.log("1. alchemy faucet: https://goerlifaucet.com/")
         console.log("2. Paradigm faucet: https://faucet.paradigm.xyz/")
     }
}

main()
