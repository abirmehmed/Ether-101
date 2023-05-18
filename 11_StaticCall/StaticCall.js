// contract.functionName.staticCall(arguments, {override})
import { ethers } from "ethers";

// prepare alchemy API, you can refer to https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// use private key and provider to create wallet object
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// DAI's ABI
const abiDAI = [
    "function balanceOf(address) public view returns(uint)",
    "function transfer(address, uint) public returns (bool)",
];
// DAI contract address (mainnet)
const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract

// create DAI contract instance
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

const main = async () => {
    try {
    const address = await wallet.getAddress()
    // 1. read DAI contract information on the chain
    console.log("\n1. Read the DAI balance of the test wallet")
    const balanceDAI = await contractDAI.balanceOf(address)
    const balanceDAIVitalik = await contractDAI.balanceOf("vitalik.eth")

    console.log(`Test wallet DAI holdings: ${ethers.formatEther(balanceDAI)}\n`)
    console.log(`Vitalik DAI holdings: ${ethers.formatEther(balanceDAIVitalik)}\n`)
        
  // 2. use staticCall to try to call transfer to send 10000 DAI, msg.sender is Vitalik, transaction will succeed
    console.log("\n2.  use staticCall to try to call transfer to send 1 DAI, msg.sender is Vitalik's address")
    // initiate transaction
    const tx = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"})
    console.log(`Will the transaction succeed?：`, tx)

    // 3. use staticCall to try to call transfer to send 10000 DAI, msg.sender is test wallet address, transaction will fail
    console.log("\n3.  use staticCall to try to call transfer to send 1 DAI, msg.sender is test wallet address")
    const tx2 = await contractDAI.transfer.staticCall("vitalik.eth", ethers.parseEther("10000"), {from: address})
    console.log(`Will the transaction succeed?：`, tx)

    } catch (e) {
        console.log(e);
      }
}

main()

