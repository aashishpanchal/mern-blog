import morgan from "morgan";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import { notFount } from "./not-found";
import { httpError } from "./http-error";
import { errorLogs } from "./error-logs";
import { validation } from "./validation-error";
import type { Application } from "express";

export class Middleware {
  static global(app: Application) {
    // global middlewares
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());
  }

  static logger(app: Application) {
    // logger
    app.use(morgan("combined"));
  }

  static errorhandler(app: Application) {
    // error handler middlewares
    app.use(notFount);
    app.use(validation);
    app.use(errorLogs);
    app.use(httpError);
  }
}
