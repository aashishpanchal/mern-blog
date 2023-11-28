import { Router } from 'express';
import { v1Router } from './v1/api-v1.router';

export const apiRouter: Router = Router();

// add api version
apiRouter.use('/v1', v1Router);
