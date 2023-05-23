
// 1. Create an HD wallet
console.log("\n1. Create an HD wallet")
// Generate a random mnemonic phrase
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32))
// Create an HD wallet from the phrase
const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(hdNode);

// 2. Derive 20 wallets from the HD wallet
console.log("\n2. Derive 20 wallets from the HD wallet")
const numWallet = 20
// Derivation path: m / purpose' / coin_type' / account' / change / address_index
// We only need to switch the last address_index, to derive new wallets from hdNode
let basePath = "m/44'/60'/0'/0";
let wallets = [];
for (let i = 0; i < numWallet; i++) {
    let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
    let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
    console.log(`The ${i+1}th wallet address: ${walletNew.address}`)
    wallets.push(walletNew);
}

// 3. Save the wallet (encrypted json)
console.log("\n3. Save the wallet (encrypted json)")
const wallet = ethers.Wallet.fromPhrase(mnemonic)
console.log("Create a wallet from the mnemonic phrase:")
console.log(wallet)
// The password for encrypting the json, can be changed to something else
const pwd = "password"
const json = await wallet.encrypt(pwd)
console.log("The encrypted json of the wallet:")
console.log(json)

// 4. Load the wallet from the encrypted json
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
console.log("\n4. Load the wallet from the encrypted json:")
console.log(wallet2)
