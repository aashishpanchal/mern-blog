import config from "@/config";
import httpStatus from "http-status";
import { isHttpError } from "http-errors";
import type { ErrorRequestHandler } from "express";

export const httpError: ErrorRequestHandler = (error, _req, res, _next) => {
  const isDev = config.getOrThrow<boolean>("is_dev");
  // http-errors-apis recognize errors
  if (isHttpError(error))
    return res.status(error.statusCode).send({
      message: error.message,
      error: error.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(" "),
      statusCode: error.statusCode,
    });
  // internal server errors
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    message: isDev ? error.message : `Something went wrong!`,
    error: isDev ? error.name : "Internal server error",
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
  });
};
