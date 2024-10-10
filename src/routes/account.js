const express = require('express');
const bcrypt = require('bcryptjs');
const accountSchema = require('../models/account');

const router = express.Router();

const getAccountByEmail = require('../services/account');

// Create user
router.post('/create-account', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const account = new accountSchema({
            ...req.body,
            clave_hash: hashedPassword,
        });
        
        const newAccount = await account.save();
        res.json(newAccount);
    } catch(error){
        res.json({message: error});
    }
});

module.exports = router;
