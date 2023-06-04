

# Ethers Getting Started: 18. Digital Signature Script

I've been relearning `ethers.js` recently, consolidating some details, and also writing a `WTF Ethers Getting Started` for beginners.

**Twitter**: [@0xAA_Science](https://twitter.com/0xAA_Science)

**WTF Academy Community**: [Official website wtf.academy](https://wtf.academy) | [WTF Solidity Tutorial](https://github.com/AmazingAng/WTF-Solidity) | [discord](https://discord.gg/5akcruXrsk) | [WeChat group application](https://docs.google.com/forms/d/e/1FAIpQLSe4KGT8Sh6sJ7hedQRuIYirOoZK_85miz3dw7vA1-YjodgJ-A/viewform?usp=sf_link)

All code and tutorials are open source on github: [github.com/WTFAcademy/WTF-Ethers](https://github.com/WTFAcademy/WTF-Ethers)

-----

In this lecture, we introduce a method of using off-chain signatures as a whitelist to distribute `NFTs`. If you are not familiar with the `ECDSA` contract, please see [WTF Solidity Getting Started Lecture 37: Digital Signature](https://github.com/AmazingAng/WTF-Solidity/blob/main/37_Signature/readme.md).

## Digital Signature

If you have used `opensea` to trade `NFTs`, you will not be unfamiliar with signatures. The following picture is the window that pops up when the little fox (`metamask`) wallet performs a signature. It can prove that you own the private key without revealing it to the public.

This is a possible translation:

Ethereum uses a digital signature algorithm called Elliptic Curve Digital Signature Algorithm (`ECDSA`), which is based on the elliptic curve "private key-public key" pair digital signature algorithm. It mainly plays [three roles](https://en.wikipedia.org/wiki/Digital_signature):

1. **Identity authentication**: Prove that the signer is the holder of the private key.
2. **Non-repudiation**: The sender cannot deny sending the message.
3. **Integrity**: The message cannot be modified during transmission.

## Brief introduction of digital signature contract

The `SignatureNFT` contract in [WTF Solidity Getting Started Lecture 37: Digital Signature](https://github.com/AmazingAng/WTF-Solidity/blob/main/37_Signature/readme.md) uses `ECDSA` to verify the whitelist and mint `NFTs`. We will talk about two important functions:

1. Constructor: Initialize the name, symbol, and signature public key `signer` of the NFT.

2. `mint()`: Use `ECDSA` to verify the whitelist address and mint. The parameters are the whitelist address `account`, the minted `tokenId`, and the signature `signature`.

## Generating digital signatures

1. Packing messages: In Ethereum's `ECDSA` standard, the signed `message` is the `keccak256` hash of a set of data, which is of type `bytes32`. We can use the `solidityKeccak256()` function provided by `ethers.js` to pack any content we want to sign and calculate the hash. It is equivalent to `keccak256(abi.encodePacked())` in `solidity`.

    In the following code, we pack an `address` type variable and a `uint256` type variable and hash them to get the `message`:
    ```js
    // Create message
    const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
    const tokenId = "0"
    // Equivalent to Solidity's keccak256(abi.encodePacked(account, tokenId))
    const msgHash = ethers.solidityKeccak256(
        ['address', 'uint256'],
        [account, tokenId])
    console.log(`msgHash：${msgHash}`)
    // msgHash：0x1bf2c0ce4546651a1a2feb457b39d891a6b83931cc2454434f39961345ac378c
    ```

2. Signing: To avoid users mistakenly signing malicious transactions, `EIP191` advocates adding the character `"\x19Ethereum Signed Message:\n32"` before the `message`, then doing another `keccak256` hash to get the `Ethereum signed message`, and then signing it. The wallet class of `ethers.js` provides the `signMessage()` function for signing according to the `EIP191` standard. Note that if the `message` is of type `string`, you need to use the `arrayify()` function to process it. Example:
    ```js
    // Sign
    const messageHashBytes = ethers.getBytes(msgHash)
    const signature = await wallet.signMessage(messageHashBytes);
    console.log(`Signature：${signature}`)
    // Signature：0x390d704d7ab732ce034203599ee93dd5d3cb0d4d1d7c600ac11726659489773d559b12d220f99f41d17651b0c1c6a669d346a397f8541760d6b32a5725378b241c
    ```

1. First, a `provider` and `wallet` are created, where the `wallet` is used for signing.

    ```js
    // Prepare the alchemy API. You can refer to https://github.com/AmazingAng/WTF-Solidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md
    const ALCHEMY_GOERLI_URL = 'https://eth-goerli.alchemyapi.io/v2/GlaeWuylnNM3uuOo-SAwJxuwTdqHaY5l';
    const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
    // Create a wallet object using the private key and provider
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
    const wallet = new ethers.Wallet(privateKey, provider)
    ```

2. A `message` is generated and signed based on the whitelisted addresses and the `tokenId` they can mint.
    ```js
    // Create a message
    const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
    const tokenId = "0"
    // Equivalent to keccak256(abi.encodePacked(account, tokenId)) in Solidity
    const msgHash = ethers.solidityPackedKeccak256(
        ['address', 'uint256'],
        [account, tokenId])
    console.log(`msgHash：${msgHash}`)
    // Sign the message
    const messageHashBytes = ethers.getBytes(msgHash)
    const signature = await wallet.signMessage(messageHashBytes);
    console.log(`Signature：${signature}`)
    ```

3. A contract factory is created to prepare for the deployment of the `NFT` contract.
    ```js
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
    ```

4. The NFT contract is deployed using the contract factory.

    ```js
    // Deploy the contract and fill in the constructor parameters
    const contractNFT = await factoryNFT.deploy("WTF Signature", "WTF", wallet.address)
    console.log(`Contract address: ${contractNFT.target}`);
    console.log("Waiting for contract deployment on-chain")
    await contractNFT.waitForDeployment()
    // You can also use contractNFT.deployTransaction.wait()
    console.log("Contract is on-chain")
    ```

5. The `mint()` function of the `NFT` contract is called, using off-chain signature verification of the whitelist to mint an `NFT` for the `account` address.

    ```js
    console.log(`NFT name: ${await contractNFT.name()}`)
    console.log(`NFT symbol: ${await contractNFT.symbol()}`)
    let tx = await contractNFT.mint(account, tokenId, signature)
    console.log("Minting in progress, waiting for transaction on-chain")
    await tx.wait()
    console.log(`Mint successful, NFT balance of address ${account}: ${await contractNFT.balanceOf(account)}\n`)
    ```

## For Production Use

Using digital signatures to verify whitelisted issuance of `NFTs` in a production environment mainly involves the following steps:

1. Determine the whitelist.
2. Maintain a signing wallet on the backend and generate the `message` and `signature` for each whitelist.
3. Deploy the `NFT` contract and save the public key `signer` of the signing wallet in the contract.
4. When users mint, they request the corresponding `signature` from the backend for their address.
5. Users call the `mint()` function to mint the `NFT`.

## Summary

In this lesson, we introduced how to use `ethers.js` with smart contracts to verify whitelists and issue `NFTs` using off-chain digital signatures. `Merkle Tree` and off-chain digital signatures are currently the most mainstream and economical ways to issue whitelists. If the whitelist is already determined at the time of contract deployment, it is recommended to use a `Merkle Tree`. If new whitelists need to be added continuously after contract deployment, such as Galaxy Project's `OAT`, it is recommended to use off-chain signatures. Otherwise, you will need to constantly update the `root` of the `Merkle Tree` in the contract, consuming more gas.

