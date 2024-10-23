const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const operationSchema = require('../models/operation');
const {model} = require("mongoose");

const router = express.Router();


/*Post create operation  =>http://localhost:9000/api/v1/create-operation

formato json ejmeplo
{
    "letraId": "6718bd93610154c7efbecea3",    -> pone el id de una cartera existente
    "banco": "Banco Tren Aragua",
    "tasaEfectivaAnual": 0.25,
    "desgravamen": 0.01
}

*/

router.post('/create-operation', authMiddleware, async (req, res) => {
    try {
        const { letraId, banco, tasaEfectivaAnual, desgravamen } = req.body;

        if (!letraId || !banco || !tasaEfectivaAnual || !desgravamen) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const letra = await model('Letra').findById(letraId);
        if (!letra) {
            return res.status(404).json({ message: 'Letra no encontrada' });
        }

        const nuevaOperacion = new operationSchema({
            letraId,
            banco,
            tasaEfectivaAnual,
            desgravamen
        });

        const operacionGuardada = await nuevaOperacion.save();

        res.status(201).json(operacionGuardada);
    } catch (error) {
        console.error('Error al crear la operación:', error);
        res.status(500).json({ message: 'Error al crear la operación' });
    }
});

module.exports = router;
