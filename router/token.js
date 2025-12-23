const express = require('express');
const router = express.Router();
const tokenService = require('../services/tokenService.js');
const { ethers } = require('ethers');
const adminAuth = require('../middlewares/adminAuth.js');




router.get('/total-supply', async (req, res) => {
    try {
        const supply = await tokenService.getTotalSupply();
        console.log(supply);
        res.json({ totalSupply: supply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/mint-token', adminAuth, async (req, res) => {

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
            console.log(err);
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

router.post('/burnToken', async (req, res) => {
    const { to, amount } = req.body;

    if (!to || !amount) {
        return res.status(400).json({ error: "to and amount are required" });
    }

    if (!ethers.isAddress(to)) {
        return res.status(400).json({ error: "Invalid wallet address" });
    }
    await tokenService
        .borunToke(to, amount)
        .then((txHash) => {
            console.log("Tokens burned successfully:", txHash);

            res.status(200).json({
                success: true,
                message: "Tokens burned successfully",
                txHash
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                error: err.message
            });
        });

});


router.get('/checkNetwork', async (req, res) => {
    try {
        const network = await tokenService.checkNetwork();
        console.log(network);

        res.status(200).send({
            success: true,
            chainId: network.chainId.toString(),
            name: network.name
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/getTransactionStatus', async (req, res) => {
    const { txHash } = req.body;
    if (!txHash) {
        return res.status(400).json({ error: "txHash is required" });
    }

    await tokenService.getTransactionStatus(txHash).then((receipt) => {
        if (!receipt) {
            return res.status(200).json({
                status: "PENDING"
            });
        }

        res.status(200).send({
            status: receipt.status === 1 ? "SUCCESS" : "FAILED",
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        });
    })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ error: err.message });
        });
});


module.exports = router;
