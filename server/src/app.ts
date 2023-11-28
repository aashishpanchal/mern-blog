import morgan from 'morgan';
import express from 'express';
import httpErrors from 'http-errors';
import cookieParser from 'cookie-parser';
import { db } from './database/mongo.config';
import { apiRouter } from './apis/api.router';
import { errorLogger } from './middleware/error-logger';
import { errorHandler } from './middleware/error-handler';
import { validation } from './middleware/validation-error';

export async function App(): Promise<express.Application> {
  db.$connect();
  // create express application
  const app = express();
  // middlewares
  app.use(morgan('common'));
  app.use(cookieParser());
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));
  // api router
  app.use('/api', apiRouter);
  // Not found
  app.all('*', (req) => {
    throw new httpErrors.NotFound(`Cannot ${req.method} ${req.originalUrl}`);
  });
  // errors handler middlewares
  app.use(validation);
  app.use(errorLogger);
  app.use(errorHandler);
  // return app
  return app;
}
