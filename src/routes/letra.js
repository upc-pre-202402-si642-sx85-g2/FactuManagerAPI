const express = require('express');

const letraSchema = require('../models/letra');
const carteraSchema = require('../models/cartera');

const router = express.Router();

router.post('/create-letra', async (req, res) => {
    try {
        const letra = new letraSchema({
            ...req.body
        });

        const newLetra = await letra.save();
        res.json(newLetra);
    } catch(error){
        res.json(error.message);
    }
})

router.get('/letras/:id', async (req, res) => {
    try {
        const letras = await letraSchema.find({ id_cartera: req.params.id });
        res.json(letras);
    } catch(error) {
        res.json(error.message);
    }    
})

module.exports = router;