const mongoose = require('mongoose');

const facturaLetraSchema = new mongoose.Schema({
    carteraId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
    },
    razon_social: {
        type: String,
        required: true,
    },
    ruc: {
        type: String,
        required: true,
    },
    fecha_emision: {
        type: Date,
        required: true,
    },
    fecha_descuento: {
        type: Date,
        required: true,
    },
    fecha_vencimiento: {
        type: Date,
        required: true,
    },
    valor_nominal: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('FacturaLetra', facturaLetraSchema);