import { errorResponse } from '../helpers';
import { ValidationError } from 'express-validation';
import {NextFunction, Request, Response} from "express";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: any, req: Request, res:Response, next:NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  } else if (err && err.message === 'validation error') {
    let messages = err.errors.map( (e: { field: any; }) => e.field);
    if (messages.length && messages.length > 1) {
      messages = `${messages.join(', ')} are required fields`;
    } else {
      messages = `${messages.join(', ')} is required field`;
    }
    return errorResponse(req, res, messages, "VALIDATION_ERROR", 400, err);
  } else {
    return errorResponse(req, res, "Generic error", "GENERIC_ERROR", 400, err);
  }
};

export default errorHandler;
