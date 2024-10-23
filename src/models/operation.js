const mongoose = require('mongoose');
const { calculatePeriodoDias, calculateValorEntregado, calculateValorRecibido, calculateTEAForPeriod, calculateTasaDescontada, calculateTCEA } = require('../utils/calculations');


const OperationSchema = new mongoose.Schema({
    letraId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Letra',
        required: true,
    },
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
    created_at: {
        type: Date,
        default: Date.now
    },
});

// busca  datos necesairos a partir de la letra para calcular los valores de la operacion
OperationSchema.pre('save', async function(next) {
    const letra = await mongoose.model('Letra').findById(this.letraId);

    if (!letra) {
        throw new Error('Letra no encontrada');
    }

    const periodoDias = calculatePeriodoDias(letra.fecha_vencimiento, letra.fecha_descuento);
    const teaForPeriod = calculateTEAForPeriod(this.tasa_efectiva_anual, periodoDias);
    const tasaDescontada = calculateTasaDescontada(teaForPeriod);
    const valorEntregado = calculateValorEntregado(letra.valor_nominal);
    const valorRecibido = calculateValorRecibido(letra.valor_nominal, tasaDescontada, this.desgravamen);
    const tcea = calculateTCEA(valorEntregado, valorRecibido, periodoDias);

    //se actuliza los vaores calculados
    this.periodo_dias = periodoDias;
    this.tea_for_period = teaForPeriod;
    this.valor_entregado = valorEntregado;
    this.valor_recibido = valorRecibido;
    this.tasa_descontada = tasaDescontada;
    this.tcea = tcea;

    next();
});

module.exports = mongoose.model('Operation', OperationSchema);
