import logger from "@/common/logger";
import { isHttpError } from "http-errors";
import { saveErrorLog } from "@/lib/save-log";
import type { ErrorRequestHandler } from "express";

export const errorLogs: ErrorRequestHandler = (error, _req, _res, next) => {
  if (!isHttpError(error)) {
    // save error log
    saveErrorLog(error);
    // console on error
    logger.error(error);
  }
  next(error);
};
