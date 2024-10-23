const calculatePeriodoDias = (fecha_vencimiento, fecha_descuento) => {
    const diffTime = Math.abs(new Date(fecha_vencimiento) - new Date(fecha_descuento));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateTEAForPeriod = (tasaEfectivaAnual, periodo_dias) => {
    return Math.pow((1 + tasaEfectivaAnual), (periodo_dias / 360)) - 1;
};
const calculateTasaDescontada = (tea_for_period) => {
    return tea_for_period / (1 + tea_for_period);
};

const calculateValorRecibido = (valor_nominal, tasa_descontada, desgravamen) => {
    const vneto = valor_nominal * (1-tasa_descontada);
    return vneto - (desgravamen * valor_nominal);
};

const calculateValorEntregado = (valor_nominal) => {
    return valor_nominal;
};

const calculateTCEA = (valor_entregado, valor_recibido, periodo_dias) => {
    return Math.pow((valor_entregado / valor_recibido), (360 / periodo_dias)) - 1;
};

module.exports = {
    calculatePeriodoDias,
    calculateValorEntregado,
    calculateValorRecibido,
    calculateTEAForPeriod,
    calculateTasaDescontada,
    calculateTCEA
};
