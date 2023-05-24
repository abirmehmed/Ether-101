import { ethers } from "ethers";

// 1. Create HD wallet
console.log("\n1. Create HD wallet")
// Generate HD wallet from mnemonic phrase
const mnemonic = `air organ twist rule prison symptom jazz cheap rather dizzy verb glare jeans orbit weapon universe require tired sing casino business anxiety seminar hunt`
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode);

// 2. Get 20 wallet addresses
console.log("\n2. Derive 20 wallets from HD wallet")
const numWallet = 20
// Derivation path: m / purpose' / coin_type' / account' / change / address_index
// We only need to switch the last bit address_index, and we can derive new wallets from hdNode
let basePath = "m/44'/60'/0'/0";
let addresses = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    addresses.push(walletNew.address);
}
console.log(addresses)
const amounts = Array(20).fill(ethers.parseEther("0.0001"))
console.log(`Send amount: ${amounts}`)

// 3. Create provider and wallet for sending tokens
// Prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// Use private key and provider to create wallet object
// If this wallet has no goerli testnet ETH
// Please use your own small wallet for testing, wallet address: 0x338f8891D6BdC58eEB4754352459cC461EfD2a5E , please do not send any ETH to this address
// Be careful not to upload your private key to github
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

