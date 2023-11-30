import express from 'express';
import httpErrors from 'http-errors';
import { container } from 'tsyringe';
import { Middleware } from './middleware';
import { db } from './database/mongo.config';
import { apiRouter } from './apis/api.router';
import { serveStaticFile } from './utils/serve-file';

export async function App(): Promise<express.Application> {
  db.$connect();
  // create express application
  const app = express();
  // middlewares
  const middleware = container.resolve(Middleware);
  // server static file
  serveStaticFile(app, { exclude: ['/api/(.*)'] });
  // global middleware
  middleware.global(app);
  // logger middleware
  middleware.logger(app);
  // api router
  app.use('/api', apiRouter);
  // Not found
  app.all('*', (req) => {
    throw new httpErrors.NotFound(`Cannot ${req.method} ${req.originalUrl}`);
  });
  // errors handler middlewares
  middleware.errors(app);
  // return app
  return app;
}
