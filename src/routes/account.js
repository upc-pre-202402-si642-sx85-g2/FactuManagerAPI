const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const accountSchema = require('../models/account');
const carteraSchema = require('../models/cartera');

const router = express.Router();

const getAccountByEmail = require('../services/account');

// Create account
router.post('/create-account', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const account = new accountSchema({
            ...req.body,
            clave_hash: hashedPassword,
            fecha_nacimiento: req.body.fecha_nacimiento // El formato debe ser YYYY-MM-DD
        });
        
        const newAccount = await account.save();

        await carteraSchema.create({id_account: newAccount._id, cantidad_letras: 0});

        res.json(newAccount);
    } catch(error){
      if (error.name == 'ValidationError') {
        return res.status(400).json({message: error.message});
      }
      res.status(500).json({message: error.message});
    }
});

// Sign-in
router.post('/sign-in', async(req, res) => {
    try {
        const { email, password } = req.body;
    
        const account = await getAccountByEmail(email);
        if (!account) {
          return res.status(404).send('Usuario no encontrado');
        }
  
        const isMatch = await bcrypt.compare(password, account.clave_hash);
        if (!isMatch) {
          return res.status(401).send('Contraseña incorrecta');
        }
    
        const token = jwt.sign({ id: account._id }, 'banbifBDTok$nPa$%', { expiresIn: '1h' });
    
        res.send({ token, userId: account._id });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
      }
})



module.exports = router;
