module.exports = (error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';
  const { message } = error;
  response.status(statusCode).json({
    status,
    message,
  });
};
