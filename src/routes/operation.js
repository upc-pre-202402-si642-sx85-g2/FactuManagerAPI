const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const operationSchema = require('../models/operation');
const carteraSchema = require('../models/cartera'); // Agregar esta línea

const { model } = require("mongoose");

const router = express.Router();

/*Post create operation  =>http://localhost:9000/api/v1/create-operation

formato json ejmeplo

{
    "letraIds": [
        "6718cdde31721fc8164cdc0c",  // id de la letra que exiwsta en la bd
        "67270690e1e023a443e8ac3f",
        "6727070de1e023a443e8ac45"
    ],
    "banco": "Banco BBVA",
    "tasa_efectiva_anual": 0.50,
    "desgravamen": 0.008
}

*/

router.post('/create-operation', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { letraIds, banco, tasa_efectiva_anual, desgravamen } = req.body;

        if (!letraIds || letraIds.length === 0 || !banco || !tasa_efectiva_anual || !desgravamen) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verifica si el usuario tiene una cartera asociada usando id_account
        const cartera = await carteraSchema.findOne({ id_account: userId });
        if (!cartera) {
            return res.status(404).json({ message: 'Cartera no encontrada para el usuario' });
        }

        // Crear la operación
        const nuevaOperacion = new operationSchema({
            letraIds,
            walletId: cartera._id,
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


//get traer todos los usuarios autenticado
router.get('/operationsAuth', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // Buscar la cartera asociada al usuario
        const cartera = await carteraSchema.findOne({ id_account: userId });
        if (!cartera) {
            return res.status(404).json({ message: 'Cartera no encontrada para el usuario' });
        }

        // Buscar todas las operaciones asociadas a la cartera del usuario
        const operaciones = await operationSchema.find({ walletId: cartera._id });

        // Mapear las operaciones para devolver solo los campos deseados
        const operacionesFormateadas = operaciones.map(operation => {
            return operation.operaciones.map(op => ({
                bank: operation.banco,
                nominalValue: op.valor_nominal,
                tea: operation.tasa_efectiva_anual,
                tcea: op.tcea,
                periodInDays: op.periodo_dias,
                tep: op.tea_for_period,
                discountedRate: op.tasa_descontada,
                deliveredValue: op.valor_entregado,
                receivedValue: op.valor_recibido
            }));
        }).flat();

        res.json(operacionesFormateadas);
    } catch (error) {
        console.error('Error al obtener las operaciones del usuario:', error);
        res.status(500).json({ message: 'Error al obtener las operaciones del usuario' });
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
