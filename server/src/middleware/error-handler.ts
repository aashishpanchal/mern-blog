import httpStatus from 'http-status';
import { isHttpError } from 'http-errors';
import { config } from '@/config/config.service';
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const isDev = config.getOrThrow<boolean>('isDev');
  // http-errors-apis recognize errors
  if (isHttpError(error)) {
    return res.status(error.statusCode).send({
      message: error.message,
      error: error.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' '),
      statusCode: error.statusCode,
    });
  } else {
    // internal server errors
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: isDev ? error.message : `Something went wrong!`,
      error: isDev ? error.name : 'Internal server error',
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
