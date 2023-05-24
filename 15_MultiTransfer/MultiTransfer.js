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

// 4. Declare Airdrop contract
// Airdrop's ABI
const abiAirdrop = [
    "function multiTransferToken(address,address[],uint256[]) external",
    "function multiTransferETH(address[],uint256[]) public payable",
];
// Airdrop contract address (Goerli testnet)
const addressAirdrop = '0x71C2aD976210264ff0468d43b198FD69772A25fa' // Airdrop Contract
// Declare Airdrop contract
const contractAirdrop = new ethers.Contract(addressAirdrop, abiAirdrop, wallet)

// 5. Declare WETH contract
// WETH's ABI
const abiWETH = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
    "function approve(address, uint256) public returns (bool)"
];
// WETH contract address (Goerli testnet)
const addressWETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' // WETH Contract
// Declare WETH contract
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet)


const main = async () => {

    // 6. Read the ETH and WETH balance of an address
    console.log("\n3. Read the ETH and WETH balance of an address")
    //Read WETH balance
    const balanceWETH = await contractWETH.balanceOf(addresses[10])
    console.log(`WETH holdings: ${ethers.formatEther(balanceWETH)}\n`)
    //Read ETH balance
    const balanceETH = await provider.getBalance(addresses[10])
    console.log(`ETH holdings: ${ethers.formatEther(balanceETH)}\n`)

    const myETH = await provider.getBalance(wallet)
    const myToken = await contractWETH.balanceOf(wallet.getAddress())
    // If wallet ETH is enough and WETH is enough
    if(ethers.formatEther(myETH) > 0.002 && ethers.formatEther(myToken) >= 0.002){

        // 7. Call multiTransferETH() function to transfer 0.0001 ETH to each wallet
        console.log("\n4. Call multiTransferETH() function to transfer 0.0001 ETH to each wallet")
        // Initiate transaction
        const tx = await contractAirdrop.multiTransferETH(addresses, amounts, {value: ethers.parseEther("0.002")})
        // Wait for transaction to be on chain
        await tx.wait()
        // console.log(`Transaction details:`)
        // console.log(tx)
        const balanceETH2 = await provider.getBalance(addresses[10])
        console.log(`After sending, the wallet ETH holdings: ${ethers.formatEther(balanceETH2)}\n`)
        
        // 8. Call multiTransferToken() function to transfer 0.0001 WETH to each wallet
        console.log("\n5. Call multiTransferToken() function to transfer 0.0001 WETH to each wallet")
        // First approve WETH to Airdrop contract
        const txApprove = await contractWETH.approve(addressAirdrop, ethers.parseEther("1"))
        await txApprove.wait()
        // Initiate transaction
        const tx2 = await contractAirdrop.multiTransferToken(addressWETH, addresses, amounts)
        // Wait for transaction to be on chain
        await tx2.wait()
        // console.log(`Transaction details:`)
        // console.log(tx2)
        // Read WETH balance
        const balanceWETH2 = await contractWETH.balanceOf(addresses[10])
        console.log(`After sending, the wallet WETH holdings: ${ethers.formatEther(balanceWETH2)}\n`)

    }else{
        // If ETH and WETH are not enough
        console.log("Not enough ETH, please use your own small wallet for testing and exchange some WETH")
        console.log("1. chainlink faucet: https://faucets.chain.link/goerli")
        console.log("2. paradigm faucet: https://faucet.paradigm.xyz/")
    }
}

main()

