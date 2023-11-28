import { isHttpError } from 'http-errors';
import { saveErrorLog } from '@/utils/save-log';
import { logger } from '@/logger/logger.service';
import type { ErrorRequestHandler } from 'express';

export const errorLogger: ErrorRequestHandler = (error, _req, _res, next) => {
  if (!isHttpError(error)) {
    // save error log
    saveErrorLog(error);
    // console on error
    logger.error(error);
  }
  next(error);
};
