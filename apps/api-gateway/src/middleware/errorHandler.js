const { ZodError } = require('zod');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => { // eslint-disable-line
  const isKnown = err instanceof ApiError;
  const status = isKnown ? err.statusCode : 500;
  const payload = {
    success: false,
    message: err.message || 'Internal server error'
  };

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: err.errors
    });
  }

  if (isKnown && err.details) {
    payload.details = err.details;
  }

  if (env.nodeEnv !== 'production' && !isKnown) {
    payload.stack = err.stack;
  }

  if (!isKnown) {
    console.error(err);
  }

  res.status(status).json(payload);
};

module.exports = errorHandler;