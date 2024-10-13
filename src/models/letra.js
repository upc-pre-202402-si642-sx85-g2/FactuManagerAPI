const mongoose = require('mongoose');

const LetraSchema = new mongoose.Schema({
    carteraId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
    },
    razon_social: {
        type: String,
        required: [true, 'Business Name is requires field!'],
    },
    ruc: {
        type: String,
        required: [true, 'RUC is requires field!'],
        validate: {
            validator: function(v) {
                return /^\d{11}$/.test(v);
            },
            message: props => `${props.value} is a invalid RUC. It must have 11 numerical digits.`
        }
    },
    fecha_emision: {
        type: Date,
        required: [true, 'Issue date is requires field!'],
    },
    fecha_descuento: {
        type: Date,
        required: [true, 'Discount date is requires field!'],
        validate: {
            validator: function(v) {
                return this.fecha_emision && this.fecha_vencimiento && v > this.fecha_emision && v < this.fecha_vencimiento;
            },
            message: props => `Discount date (${props.value}) must be after the issue date and before the expiration date.`
        }
    },
    fecha_vencimiento: {
        type: Date,
        required: [true, 'Expiration date is requires field!'],
        validate: [
            {
                validator: function(v) {
                    return v > new Date();
                },
                message: props => `Expiration date (${props.value}) must be after the current date.`
            },
            {
                validator: function(v) {
                    return this.fecha_emision && (v - this.fecha_emision) <= 365 * 24 * 60 * 60 * 1000; // 1 año en milisegundos
                },
                message: props => `Expiration date (${props.value}) must be within one year of the issue date.`
            }
        ]
    },
    valor_nominal: {
        type: Number,
        required: [true, 'Nominal value is requires field!'],
        min: 1000,
        max: 500000
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

LetraSchema.pre('save', function(next) {
    if(this.fecha_emision && this.fecha_descuento && this.fecha_vencimiento) {
        this.fecha_emision = new Date(this.fecha_emision);
        this.fecha_descuento = new Date(this.fecha_descuento);
        this.fecha_vencimiento = new Date(this.fecha_vencimiento)
    }
    next();
})

module.exports = mongoose.model('Letra', LetraSchema);