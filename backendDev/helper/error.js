import { NODE_ENV } from "../config/env.js";

export default class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });
};

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}