const mongoose = require('mongoose');
const { calculatePeriodoDias, calculateValorEntregado, calculateValorRecibido, calculateTEAForPeriod, calculateTasaDescontada, calculateTCEA } = require('../utils/calculations');


const OperationSchema = new mongoose.Schema({
    letraIds: [{  //array lista de letras
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Letra',
        required: true,
    }],
    banco: {
        type: String,
        required: true,
    },
    tasa_efectiva_anual: {
        type: Number,
        required: true,
    },
    desgravamen: {
        type: Number,
        required: true,
    },
    valor_entregado: {
        type: Number,
        required: false,
    },
    valor_recibido: {
        type: Number,
        required: false,
    },
    tcea: {
        type: Number,
        required: false,
    },
    tea_for_period: {
        type: Number,
        required: false,
    },
    periodo_dias: {
        type: Number,
        required: false,
    },
    tasa_descontada: {
        type: Number,
        required: false,
    },
    operaciones: [{ // Array para almacenar los resultados de cada "letra"
        valor_entregado: Number,
        valor_recibido: Number,
        tcea: Number,
        tea_for_period: Number,
        periodo_dias: Number,
        tasa_descontada: Number,
    }],
    total_valor_entregado: {
        type: Number,
        required: false
    },
    total_valor_recibido: {
        type: Number,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

// Middleware `pre('save')` para calcular cada letra en `letraIds`
OperationSchema.pre('save', async function(next) {
    // Array para almacenar operaciones de cada letra
    this.operaciones = [];
// busca  datos necesairos a partir de la letra para calcular los valores de la operacion
    for (const letraId of this.letraIds) {
        const letra = await mongoose.model('Letra').findById(letraId);

        if (!letra) {
            throw new Error(`Letra con ID ${letraId} no encontrada`);
        }

        const periodoDias = calculatePeriodoDias(letra.fecha_vencimiento, letra.fecha_descuento);
        const teaForPeriod = calculateTEAForPeriod(this.tasa_efectiva_anual, periodoDias);
        const tasaDescontada = calculateTasaDescontada(teaForPeriod);
        const valorEntregado = calculateValorEntregado(letra.valor_nominal);
        const valorRecibido = calculateValorRecibido(letra.valor_nominal, tasaDescontada, this.desgravamen);
        const tcea = calculateTCEA(valorEntregado, valorRecibido, periodoDias);

        // Agregar resultados al array de operaciones
        this.operaciones.push({
            valor_entregado: valorEntregado,
            valor_recibido: valorRecibido,
            tcea,
            tea_for_period: teaForPeriod,
            periodo_dias: periodoDias,
            tasa_descontada: tasaDescontada,

        });
    }
    //calula ña suma total de valore recibidos y entregados de todas las letras
    this.total_valor_entregado = this.operaciones.reduce((sum, op) => sum + op.valor_entregado, 0);
    this.total_valor_recibido = this.operaciones.reduce((sum, op) => sum + op.valor_recibido, 0);
    next();
});

module.exports = mongoose.model('Operation', OperationSchema);
