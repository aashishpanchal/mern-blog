import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { singleton } from 'tsyringe';
import { errorLogger } from './error-logger';
import { errorHandler } from './error-handler';
import { validation } from './validation-error';
import { config } from '@/config/config.service';
// types
import type { Application } from 'express';

@singleton()
export class Middleware {
  public global(app: Application) {
    app.use(
      express.json({
        limit: '16kb',
      }),
    );
    app.use(
      express.urlencoded({
        extended: true,
        limit: '16kb',
      }),
    );
  }

  public cors(app: Application) {
    app.use(
      cors({
        origin: config.getOrThrow('ORIGIN'),
      }),
    );
  }

  public logger(app: Application) {
    app.use(morgan('common'));
  }

  public errors(app: Application) {
    // errors handler middlewares
    app.use(validation);
    app.use(errorLogger);
    app.use(errorHandler);
  }
}
