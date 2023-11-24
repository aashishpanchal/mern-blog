import { Router } from "express";
import { NotFound } from "http-errors";

export const notFount: Router = Router();

notFount.all("*", (req) => {
  throw NotFound(`Cannot ${req.method} ${req.originalUrl}`);
});
