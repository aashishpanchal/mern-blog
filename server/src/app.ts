import express from "express";
import { db } from "./database/prisma";
import { apiRouter } from "./apis/router";
import { Middleware } from "./middlewares";
import type { Application } from "express";

export async function App(): Promise<Application> {
  await db.$connect();
  // create express application
  const app: Application = express();
  // static path
  app.use(express.static("public"));
  // middlewares
  Middleware.global(app);
  Middleware.logger(app);
  // api router
  app.use("/api/v1", apiRouter);
  // errors handler middlewares
  Middleware.errorhandler(app);
  // return app
  return app;
}
