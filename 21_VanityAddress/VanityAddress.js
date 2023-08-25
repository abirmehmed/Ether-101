
// Regular expression
// Matching characters after the initial "0x"
// ".*" acts as a wildcard
// Writing the characters to be matched before "$"
// Example: First two characters are "0", last two characters are "1"
// const regex = /^0x00.*11$/

import { ethers } from "ethers";
var wallet // Wallet
const regex = /^0x000.*$/ // Regular expression
var isValid = false
while(!isValid){
    wallet = ethers.Wallet.createRandom() // Randomly generate a wallet for security
    isValid = regex.test(wallet.address) // Test the regular expression
    //console.log(wallet.address)
}
// Print the lucky wallet address and private key
console.log(`\nLucky Wallet Address: ${wallet.address}`)
console.log(`Lucky Wallet Private Key: ${wallet.privateKey}\n`)
