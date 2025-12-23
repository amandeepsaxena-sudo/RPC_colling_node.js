const { constants } = require('buffer');
const { ethers } = require('ethers');
const fs = require('fs');
require('dotenv').config();


const abi = JSON.parse(fs.readFileSync('./contracts/MyToken.json'))

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);



const getTotalSupply = async () => {
    return (await contract.totalSupply()).toString();
};

const mintToken = async (to, amount) => {
    console.log("Minting tokens...");
    console.log(to, amount);
    const tx = await contract.mintToke(to, amount);
    console.log("Transaction sent. Waiting for confirmation...", tx);
    await tx.wait();
    return tx;
};

const getBalance = async (address) => {
    return (await contract.balanceOf(address)).toString();
};

const tokneTransfer = async (to, amount) => {
    console.log("Transferring tokens...");
    console.log(to, amount);
    const tx = await contract.transfer(to, amount);
    console.log("Transaction sent. Waiting for confirmation...", tx);
    await tx.wait();
    return tx;
}

const borunToke = async (to, amount) => {
    console.log("Burning tokens...");
    console.log(to, amount);
    return await contract.burn(ethers.parseEther().toString, 10).then((tx) => {
        console.log("Transaction sent. Waiting for confirmation...", tx);
        return tx.wait().then(() => tx);
    }).catch((error) => {
        console.error("Error burning tokens:", error);
        throw error;
    });
}

const checkNetwork = async () => { 
    const network = await provider.getNetwork();
    console.log("Connected to network:", network);
    return network;
};

const getTransactionStatus = async (txHash) => {
    const txReceipt = await provider.getTransactionReceipt(txHash); 
    console.log("Transaction receipt:", txReceipt);
    return txReceipt;
}


module.exports = { getTotalSupply, getBalance, mintToken, tokneTransfer, borunToke ,checkNetwork ,getTransactionStatus};