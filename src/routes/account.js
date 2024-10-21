const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const accountSchema = require('../models/account');
const carteraSchema = require('../models/cartera');

const router = express.Router();

const getAccountByEmail = require('../services/account');
const transporter = require('../utils/mailer');

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

        await carteraSchema.create({id_account: newAccount._id, cantidad_letras: 0, valor_nominal_total: 0});

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

// Request Password
router.post('/recovery-password-reset', async(req, res) => {
  const { email } = req.body;
  try {
    const account = await accountSchema.findOne( {email });
    if(!account){
      return res.status(404).json({message: 'Email not found.'});
    }

    // Generamos un token
    const token = jwt.sign( {id: account._id }, 'secret_key', { expiresIn: '1h' });
    
    // Enviar el enlace de restablecimiento de contraseña por correo electrónico
    const resetLink = `http://yourfrontend.com/reset-password?token=${token}`;
    await transporter.sendMail({
      from: 'gugultest123@gmail.com',
      to: email,
      subject: 'Reseteo de contraseña',
      text: `Click al siguiente link para resetear la contraseña: ${resetLink}`
    });
    
    res.json({ message: 'Password reset link sent to your email' });
  } catch(error){
    res.status(500).json({ message: error.message});
  }
})

// Reset Password
// Ruta para restablecer la contraseña
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
      const decoded = jwt.verify(token, 'secret_key');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await accountSchema.findByIdAndUpdate(decoded.id, { clave_hash: hashedPassword });

      res.json({ message: 'Password has been reset' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


module.exports = router;
