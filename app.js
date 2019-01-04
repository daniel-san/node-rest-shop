const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// Connecting to MongoDB server
mongoose.set('useCreateIndex', true); // Avoiding a deprecated option
mongoose.connect(process.env.MONGO_DB_ADDR + '/' + process.env.MONG_DB_DATABASE, 
  {
    useNewUrlParser: true
  }
);

// Logging module
app.use(morgan('dev'));

// Express module for making the uploads folder publicly available
app.use('/uploads', express.static('uploads'));

// Module to parse the body of requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Adding CORS headers
app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header(
    'Acess-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

// Default error for routes that do not exist
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
})

module.exports = app;