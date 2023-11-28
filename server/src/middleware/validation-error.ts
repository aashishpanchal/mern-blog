import httpStatus from 'http-status';
import { ValidationError } from 'class-validator';
import type { NextFunction, Request, Response } from 'express';

function customFormat(errors: ValidationError[]): any {
  return errors.map((error) => {
    if (error.children && error.children.length) {
      return customFormat(error.children);
    }
    return {
      field: error.property,
      errors: Object.values(error.constraints),
    };
  });
}

export function validation(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (Array.isArray(err) && err[0] instanceof ValidationError)
    res.status(httpStatus.BAD_REQUEST).json({
      message: 'Validation error',
      statusCode: httpStatus.BAD_REQUEST,
      error: customFormat(err),
    });
  else _next(err);
}
