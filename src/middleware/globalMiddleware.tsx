import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { ApiErrorHandler } from '../utils/ApiError';

export const globalErrorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  ApiErrorHandler(error, res, req);
};
