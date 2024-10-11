const express = require('express');

const carteraSchema = require('../models/cartera');

const router = express.Router();

// Get cartera by User ID
router.get('/cartera/:id', async(req, res) => {
    try{
        const cartera = await carteraSchema.find({id_account: req.params.id});
        res.json(cartera);
    } catch(error){
        res.json(error.message);
    }
})

module.exports = router;