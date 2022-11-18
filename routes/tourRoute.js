const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = require('../controller/tourController');

const Route = express.Router();

Route.route('/top-5-cheap').get(aliasTopTours, getAllTours);

Route.route('/').get(getAllTours).post(createTour);

Route.route('/:id').get(getTour).put(updateTour).delete(deleteTour);

module.exports = Route;
