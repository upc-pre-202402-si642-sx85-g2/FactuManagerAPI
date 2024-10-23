const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

// Importing routes
const accountRoutes = require('./routes/account');
const letraRoutes = require('./routes/letra');
const carteraRoutes = require('./routes/cartera')
const operationRoutes = require('./routes/operation');




const app = express();
const port = process.env.PORT || 9000;
// const cors = require('cors');

// Middleware
app.use(express.json());

/*
app.use(cors({
  origin: 'http://localhost:4200'
}));
*/

app.use('/api/v1', accountRoutes);
app.use('/api/v1', letraRoutes);
app.use('/api/v1', carteraRoutes)
app.use('/api/v1', operationRoutes);


// Routes
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Connect to DB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
