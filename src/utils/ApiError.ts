import { Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from '../config/logger';
import { v4 as uuidV4 } from 'uuid';
import { configENV } from '../config/config';
import { NODE_ENV_VAL } from '../config/constants';

export const ApiErrorHandler = (
  error: HttpError,
  res: Response,
  req: Request,
): void => {
  const statusCode = error.statusCode || error.status || 500;
  const errorId = uuidV4();
  const isProduction = configENV.nodeEnv === NODE_ENV_VAL.PRODUCTION;
  const message = isProduction ? 'Internal Server Error' : error.message;
  logger.error(error.message, {
    id: errorId,
    statusCode,
    error: error.stack,
    path: req.path,
    method: req.method,
  });
  res.status(statusCode).json({
    error: {
      // code: error.code || 'INTERNAL_SERVER_ERROR',
      ref: errorId,
      status: error.status || error.statusCode || 500,
      type: error.name,
      message: message || 'Internal Server Error',
      path: req.url,
      stack: isProduction ? null : error.stack,
      // location: '',
    },
  });
};
