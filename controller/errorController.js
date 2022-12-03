const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

const prodErrorHandler = (error, response) => {
  // Only send trusted Errors that are operational, i.e, internal coding error etc
  if (error.isOperational) {
    return response.status(error.statusCode).json({
      status: error.status,
      message: error,
    });
  }
  // otherwise send gereric error message
  return response.status(error.statusCode).json({
    status: error.status,
    message: 'something went wrong',
  });
};

const devErrorHandler = (error, response) =>
  response.status(error.statusCode).json({
    status: error.status,
    message: error,
  });

const handleValidationErrorDB = (error) => {
  const message = Object.values(error.errors).map((el) => el.message);
  return new AppError(message.join(' .'), 400);
};

const handleDuplicateKeyErrorDB = (error) => {
  const message = `Duplicate value, Please try Another value`;
  const statusCode = error.statusCode || 500;
  return new AppError(message, statusCode);
};

const handleJsonWebTokenError = () =>
  new AppError('token has been modified, please check your token again', 401);

module.exports = (error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  const isProd = process.env.NODE_ENV === 'production';
  const isDev = process.env.NODE_ENV === 'development';

  // different errors for development and production
  if (isDev) {
    devErrorHandler(error, response);
  } else if (isProd) {
    let errorCopy = { ...error };

    if (error.name === 'CastError') {
      errorCopy = handleCastErrorDB(error);
    }
    // eslint-disable-next-line no-underscore-dangle
    if (errorCopy._message === 'Validation failed') {
      errorCopy = handleValidationErrorDB(errorCopy);
    }
    if (errorCopy.code === 11000) {
      errorCopy = handleDuplicateKeyErrorDB(errorCopy);
    }
    if (errorCopy.name === 'JsonWebTokenError')
      errorCopy = handleJsonWebTokenError();

    prodErrorHandler(errorCopy, response);
  }
};
