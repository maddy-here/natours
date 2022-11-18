const express = require('express');

const {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  updateUser,
} = require('../controller/userController');

const Route = express.Router();

Route.route('/').get(getUsers).post(createUser);

Route.route('/:id').get(getUser).delete(deleteUser).put(updateUser);

module.exports = Route;
