const account = require('../models/account');
const User = require('../models/account');

async function getAccountByEmail(email) {
    try {
        const user = await account.findOne({ email });
        return user;
    } catch(error){
        console.error('Error al obtener la cuenta por email', error);
        throw error;
    }
}

module.exports = getAccountByEmail;