class AppError extends Error {
  constructor(message, statusCode) {
    // this is equavalent of calling new Error(message);
    // it will set this.message property to message passed
    super(message);
    this.statusCode = statusCode;
    this.status = this.statusCode === 404 ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
