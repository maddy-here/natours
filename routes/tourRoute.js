const express = require('express');
const { protect, restrictTo } = require('../controller/authController');

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

Route.route('/').get(protect, getAllTours).post(createTour);

Route.route('/:id')
  .get(getTour)
  .put(updateTour)
  .delete(protect, restrictTo('admin', 'field-guide'), deleteTour);

module.exports = Route;
