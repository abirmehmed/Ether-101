// Use the Wallet class to send ETH
// Since playcode does not support the ethers.Wallet.createRandom() function, we can only use VScode to run this lecture code
import { ethers } from "ethers";

// Connect to the Ethereum test network using Alchemy's rpc node
// To prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// Create a random wallet object
const wallet1 = ethers.Wallet.createRandom()
const wallet1WithProvider = wallet1.connect(provider)
const mnemonic = wallet1.mnemonic // Get the mnemonic phrase

// Create a wallet object from the private key and provider
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet2 = new ethers.Wallet(privateKey, provider)

// Create a wallet object from the mnemonic phrase
const wallet3 = ethers.Wallet.fromPhrase(mnemonic.phrase)

const main = async () => {
    // 1. Get wallet address
    const address1 = await wallet1.getAddress()
    const address2 = await wallet2.getAddress() 
    const address3 = await wallet3.getAddress() // Get address
    console.log(`1. Get wallet address`);
    console.log(`Wallet 1 address: ${address1}`);
    console.log(`Wallet 2 address: ${address2}`);
    console.log(`Wallet 3 address: ${address3}`);
    console.log(`Are wallet 1 and wallet 3 addresses the same: ${address1 === address3}`);
    
    // 2. Get mnemonic phrase
    console.log(`\n2. Get mnemonic phrase`);
    console.log(`Wallet 1 mnemonic phrase: ${wallet1.mnemonic.phrase}`)
    // Note: Wallets generated from private keys do not have mnemonic phrases
    // console.log(wallet2.mnemonic.phrase)

    // 3. Get private key
    console.log(`\n3. Get private key`);
    console.log(`Wallet 1 private key: ${wallet1.privateKey}`)
    console.log(`Wallet 2 private key: ${wallet2.privateKey}`)

    // 4. Get the number of transactions sent on the chain    
    console.log(`\n4. Get the number of transactions on the chain`);
    const txCount1 = await provider.getTransactionCount(wallet1WithProvider)
    const txCount2 = await provider.getTransactionCount(wallet2)
    console.log(`Wallet 1 number of transactions sent: ${txCount1}`)
    console.log(`Wallet 2 number of transactions sent: ${txCount2}`)

   // 5. Send ETH
    // If this wallet has no goerli testnet ETH left, go to the faucet to get some, wallet address: 0xe16C1623c1AA7D919cd2241d8b36d9E79C1Be2A2
    // 1. chainlink faucet: https://faucets.chain.link/goerli
    // 2. paradigm faucet: https://faucet.paradigm.xyz/
    console.log(`\n5. Send ETH (testnet)`);
    // i. Print balance before transaction
    console.log(`i. Balance before sending`)
    console.log(`Wallet 1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)
    console.log(`Wallet 2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
    // ii. Construct transaction request, parameters: to is the receiving address, value is the amount of ETH
    const tx = {
        to: address1,
        value: ethers.parseEther("0.001")
    }
    // iii. Send transaction, get receipt
    console.log(`\nii. Wait for transaction confirmation on the blockchain (takes a few minutes)`)
    const receipt = await wallet2.sendTransaction(tx)
    await receipt.wait() // Wait for confirmation on the chain
    console.log(receipt) // Print transaction details
    // iv. Print balance after transaction
    console.log(`\niii. Balance after sending`)
    console.log(`Wallet 1: ${ethers.formatEther(await provider.getBalance(wallet1WithProvider))} ETH`)
    console.log(`Wallet 2: ${ethers.formatEther(await provider.getBalance(wallet2))} ETH`)
}

main()
