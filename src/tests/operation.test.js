const { calculatePeriodoDias, calculateTEAForPeriod } = require('../utils/calculations');
const test = require("node:test");

test('calculatePeriodoDias should return correct number of days', () => {
    const fecha_vencimiento = '2024-12-28';
    const fecha_descuento = '2024-09-28';
    const expectedDays = 91;
    const result = calculatePeriodoDias(fecha_vencimiento, fecha_descuento);
    expect(result).toBe(expectedDays);
});

test('calculateTEAForPeriod should return correct TEA for given period', () => {
    const tasaEfectivaAnual = 0.20;
    const periodo_dias = 90;
    const expectedTEAForPeriod = Math.pow((1 + tasaEfectivaAnual), (periodo_dias / 360)) - 1;
    const result = calculateTEAForPeriod(tasaEfectivaAnual, periodo_dias);
    expect(result).toBeCloseTo(expectedTEAForPeriod, 5);
});
