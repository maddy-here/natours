const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // eslint-disable-next-line no-underscore-dangle
  const token = generateToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    user: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;
  let passwordExists;
  // 1, check if email and password is not undefined
  if (!password || !email)
    return next(new AppError('Please provide email and password', 401));

  // 2, check if email exists in DB and passowrd is true
  const user = await userModel.findOne({ email }).select('+password');
  if (user) {
    passwordExists = await user.isCorrect(password, user.password);
  }
  if (!user || !passwordExists) {
    return next(new AppError('Email or Password is incorrect', 400));
  }

  // 3, if everything is okay, send token to the FE
  // eslint-disable-next-line no-underscore-dangle
  const token = generateToken(user._id);

  return res.status(200).json({
    status: 'sucess',
    message: 'logged in successfuly',
    token,
  });
});
