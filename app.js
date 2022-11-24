const express = require('express');
const morgan = require('morgan');

const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.post('/', (req, res) => {
  res.json({ message: `You can post on this endpoint` });
});

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/user', userRoute);

// handle undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} don't exists on server`,
  });
});

module.exports = app;
