const { ethers } = require('ethers');

const adminAuth = (req, res, next) => {
    const adminAddress = req.body.to;

    if (!adminAddress) {
        return res.status(400).json({ error: "adminAddress is required" });
    }

    if (!ethers.isAddress(adminAddress)) {
        return res.status(400).json({ error: "Invalid admin wallet address" });
    }

    if (adminAddress.toLowerCase() !== process.env.ADMIN_WALLET.toLowerCase()) {
        return res.status(403).json({
            error: "Unauthorized: Admin only"
        });
    }
    next();
};

module.exports = adminAuth;