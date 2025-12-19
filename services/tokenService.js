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

const mintToken  = async (to , amount) => {
    console.log("Minting tokens...");
    console.log(to, amount);
    const tx = await contract.mintToke(to, amount);
    console.log("Transaction sent. Waiting for confirmation...", tx );
    await tx.wait();
    return tx;
};
const getBalance = async (address) => {
    return (await contract.balanceOf(address)).toString();
};


module.exports = { getTotalSupply, getBalance , mintToken};
