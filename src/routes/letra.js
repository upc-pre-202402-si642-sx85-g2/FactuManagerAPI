const express = require('express');

const letraSchema = require('../models/letra');

const router = express.Router();

// create letra
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

// get all letras by cartera ID
router.get('/letras/:id', async (req, res) => {
    try {
        const letras = await letraSchema.find({ carteraId: req.params.id });
        res.json(letras);
    } catch(error) {
        res.json(error.message);
    }    
})

// get letra by ID
router.get('/letra/:id', async (req, res) => {
    try {
        const letra = await letraSchema.find({ _id: req.params.id});
        res.json(letra);
    } catch(error){
        res.json(error.message);
    }
})

// delete Letra by ID
router.delete('/letra/:id', async(req, res) => {
    try {
        const letra = await letraSchema.findByIdAndDelete(req.params.id);
        if (!letra) {
            return res.status(404).json({message: 'Letra not found'})
        }
        res.status(200).json({ message: 'Letra deleted succesfully'})    
    } catch(error){
        res.status(500).json(error.message);
    }
})


module.exports = router;