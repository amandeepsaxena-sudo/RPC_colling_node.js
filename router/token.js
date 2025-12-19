const express = require('express');
const router = express.Router();
const tokenService = require('../services/tokenService.js');
const { ethers } = require('ethers');

router.get('/total-supply', async (req, res) => {
    try {
        const supply = await tokenService.getTotalSupply();
        console.log(supply);
        res.json({ totalSupply: supply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/mint-token', async (req, res) => {

    const { to, amount } = req.body;

    if (!to || !amount) {
        return res.status(400).json({ error: "to and amount are required" });
    }

    if (!ethers.isAddress(to)) {
        return res.status(400).json({ error: "Invalid wallet address" });
    }

     await tokenService
        .mintToken(to, amount)
        .then((txHash) => {
            console.log("Tokens minted successfully:", txHash);

            res.status(200).json({
                success: true,
                message: "Tokens minted successfully",
                txHash
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                error: err.message
            });
        });
    //     const { to, amount } = req.body;

    //    await tokenService.mintToken(to, amount).then((tx) => {
    //     if (!ethers.isAddress(to)) {
    //       return res.status(400).json({ error: "Invalid wallet address" });
    //     }
    //     console.log("Tokens minted successfully", tx.hash);
    //         res.send({ message: 'Tokens minted successfully', txHash: tx.hash });
    //     }).catch((err) => {
    //         res.status(500).json({ error: err.message });
    //     });
});



router.post('/getOwnerBalance', async (req, res) => {
    try {
        const Address = req.body.address;
        const balance = await tokenService.getBalance(Address);
        console.log(balance);
        res.json({ balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
