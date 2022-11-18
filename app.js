const express = require('express');
const morgan = require('morgan');

const tourRoute = require('./routes/tourRoute');
const userRoute = require('./routes/userRoute');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

// TODO: some todos

// FIXME: some fixes

// NOTE: some notes

// BUG: some bugs

//  somestuff
// Home Page Endpoints
app.get('/', (req, res) => {
  res.send({
    message: 'this is home page',
  });
});

app.post('/', (req, res) => {
  res.json({ message: `You can post on this endpoint` });
});

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/user', userRoute);
// routes

module.exports = app;
