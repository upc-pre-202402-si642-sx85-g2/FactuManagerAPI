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
}

module.exports = updateCantidadLetras;