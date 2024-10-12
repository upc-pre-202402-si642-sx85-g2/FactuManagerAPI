const mongoose = require('mongoose');

const carteraSchema = new mongoose.Schema({
    id_account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    fecha_descuento: {
        type: Date,
        required: false,
        nullable: true,
    },
    cantidad_letras: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Cartera', carteraSchema);