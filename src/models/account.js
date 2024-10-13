const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    nombre_completo: {
        type: String,
        required: [true, 'Full Name is required field!'],
    },
    dni: {
        type: String,
        required: [true, 'DNI is requires field!'],
        validate: {
            validator: function(v) {
                return /^\d{8}$/.test(v);
            },
            message: props => `${props.value} no es un DNI valido. Debe tener 8 digitos numericos.`
        }
    },
    email: {
        type: String,
        required: [true, 'Email is requires field!'],
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} no es un correo electrónico válido.`
        }
    },
    clave_hash:{
        type: String,
        required: [true, 'Password is requires field!'],
    },
    fecha_nacimiento: {
        type: Date,
        required: [true, 'Date of Birth is requires field!'],
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

accountSchema.pre('save', function(next) {
    if(this.fecha_nacimiento) {
        this.fecha_nacimiento = new Date(this.fecha_nacimiento);
    }
    next();
})

module.exports = mongoose.model('Account', accountSchema);
