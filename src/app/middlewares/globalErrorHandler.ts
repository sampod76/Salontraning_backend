/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
// import { errorLogger } from '../share/logger'
// import { logger } from '../share/logger'
import { ZodError } from 'zod';
import config from '../../config';
import ApiError from '../errors/ApiError';
import { handleValidationError } from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import { IGenericErrorMessage } from '../interface/error';
import { errorLogger } from '../share/logger';
import handleCastError from '../errors/handleCastError';
// import path from 'path';

/*//
 const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => { 
  */
//
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  /*
    errorLogger.error(error)
    res.status(400).send({ error }) 
  */

  /* 
   type IGenericErrorMessage = {
    path: string
    message: string
  } 
  */

  config.env === 'development'
    ? console.log(`globalErrorHandler:`, error)
    : errorLogger.error(`globalErrorHandler:`, error);

  let statusCode = 500;
  let message = 'Something went wrong';
  // let errorMessage:Array<IGenericErrorMessage>= []
  let errorMessage: IGenericErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).send({
    success: false,
    message,
    errorMessage,
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;