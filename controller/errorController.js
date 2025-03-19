const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value: ${err.keyValue.value ||
    err.keyValue.email ||
    err.keyValue.name}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    console.log('Dev API Error 😒😒😒');
    console.log(err);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error_message: err,
      stack: err.stack
    });
  }
  console.log('Dev APP Error 😒😒😒');
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    console.log('Production API Error 💥💥💥');
    if (err.isOperational) {
      console.log('Production OperationalAPI Error 💥💥💥');
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message
      });
    }
    console.log('Production Non OperationalAPI Error 💥💥💥');
    console.error('ERROR 💥', err);
    return res.status(500).render('error', {
      status: 'error',
      msg: 'Something went wrong'
    });
  }
  if (err.isOperational) {
    console.log('Production Operational APP Error 💥💥💥');
    return res.status(500).render('error', {
      status: err.status,
      msg: err.message
    });
  }
  console.log('Production Non Operational APP Error 💥💥💥');
  console.error('ERROR 💥', err);
  return res.status(500).render('error', {
    status: 'error',
    msg: 'Something went wrong'
  });
};

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';
  error.message = err.message || 'Something went wrong';

  if (process.env.NODE_ENV === 'development') {
    error = sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (error.name === 'CastError') error = handleCastErrorDB(err);
    console.log(error);
    if (error.code === 11000) {
      console.log('error.code === 11000');
      error = handleDuplicateFieldsDB(error);
    } else if (
      (error && error.name && error.name === 'ValidatorError') ||
      (error &&
        error.errors &&
        error.errors.password &&
        error.errors.password === 'ValidationError') ||
      (error && error.password && error.password === 'ValidationError') ||
      (error &&
        error.passwordConfirm &&
        error.passwordConfirm === 'ValidationError') ||
      (error &&
        error.errors &&
        error.errors.name &&
        error.errors.name === 'ValidationError') ||
      (error && error.email && error.email === 'ValidatorError') ||
      (error &&
        error.errors &&
        error.errors.email &&
        error.errors.email === 'ValidationError')
    ) {
      error = handleValidationErrorDB(error);
    }
    if (error && error.name && error.name === 'JsonWebTokenError')
      error = handleJWTError(error);

    if (error && error.name && error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    console.log(error);
    sendErrorProd(error, req, res);
  }
};
