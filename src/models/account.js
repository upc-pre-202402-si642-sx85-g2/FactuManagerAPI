const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    nombre_completo: {
        type: String,
        required: true,
    },
    dni: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    clave_hash:{
        type: String,
        required: true,
    },
    fecha_nacimiento: {
        type: Date,
        required: true,
    },
    security: {
        mfaEnabled: Boolean,
        mfaMethod: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Account', accountSchema);
