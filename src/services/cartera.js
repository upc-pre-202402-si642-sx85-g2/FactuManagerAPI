const carteraSchema = require('../models/cartera')

const updateCantidadLetras = async (id, cantidad) => {
    try {
        const cartera = await carteraSchema.findById(id);
        if( !cartera ) { 
            throw new Error('Cartera not found')
        }
        cartera.cantidad_letras += cantidad;
        await cartera.save();

    } catch (error) {
        throw new Error(error.message);
    }
};

const updateValorNominalTotal = async (id, valor) => {
    try {
        const cartera = await carteraSchema.findById(id);
        if(!cartera) {
            throw new Error("Carte not found")
        }
        cartera.valor_nominal_total += valor;
        await cartera.save();
    } catch (error){
        throw new Error(error.message);
    }
};

module.exports = {
    updateCantidadLetras, 
    updateValorNominalTotal
};