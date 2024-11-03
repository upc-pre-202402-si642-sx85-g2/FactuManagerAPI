const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const operationSchema = require('../models/operation');
const {model} = require("mongoose");

const router = express.Router();


/*Post create operation  =>http://localhost:9000/api/v1/create-operation

formato json ejmeplo

{
    "letraId": "6718cdde31721fc8164cdc0c",  =>pone el id de una letra existente
    "banco": "Banco BBVA",
    "tasa_efectiva_anual": 0.30,
    "desgravamen": 0.003
}

*/

router.post('/create-operation', authMiddleware, async (req, res) => {
    try {
        const { letraIds, banco, tasa_efectiva_anual, desgravamen } = req.body;

        if (!letraIds || letraIds.length === 0 || !banco || !tasa_efectiva_anual || !desgravamen) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar que todas las letras existan
        for (const id of letraIds) {
            const letra = await model('Letra').findById(id);
            if (!letra) {
                return res.status(404).json({ message: `Letra con ID ${id} no encontrada` });
            }
        }

        // Crear la operación con múltiples letras
        const nuevaOperacion = new operationSchema({
            letraIds,
            banco,
            tasa_efectiva_anual,
            desgravamen
        });

        const operacionGuardada = await nuevaOperacion.save();

        res.status(201).json(operacionGuardada);
    } catch (error) {
        console.error('Error al crear la operación:', error);
        res.status(500).json({ message: 'Error al crear la operación' });
    }
});

// Get  para traer todas las operaciones de una letra
router.get('/operations/:letraId', authMiddleware, async (req, res) => {
    try {
        const operations = await operationSchema.find({ letraId: req.params.letraId });
        res.json(operations);
    } catch (error) {
        console.error('Error al obtener las operaciones:', error);
        res.status(500).json({ message: 'Error al obtener las operaciones' });
    }
});

// Get para traer una operacion por id
router.get('/operation/:operationId', authMiddleware, async (req, res) => {
    try {
        const operation = await operationSchema.findById(req.params.operationId);
        if (!operation) {
            return res.status(404).json({ message: 'Operación no encontrada' });
        }
        res.json(operation);
    } catch (error) {
        console.error('Error al obtener la operación:', error);
        res.status(500).json({ message: 'Error al obtener la operación' });
    }
});



module.exports = router;
