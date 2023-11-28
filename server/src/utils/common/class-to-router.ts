import { Router } from 'express';
import { container } from 'tsyringe';
import { wrapper } from './utils/wrapper';
import { MIDDLE_KEY, ROUTES_KEY } from './constants';
// types
import type { MetaData } from './interface';
import type { RequestHandler } from 'express';

// this is function help to extract all request handler from class controller
export function getRouterForClass(...cls: any[]) {
  const routers = cls.map((cls) => {
    // express router
    const router: Router = Router();
    // make instance of class
    const instance = container.resolve(cls);
    // get global middleware
    const globalMiddleware: RequestHandler[] =
      Reflect.getMetadata(MIDDLE_KEY, instance.constructor) || [];
    // set global middleware
    globalMiddleware.forEach((func) => router.use(func));
    // get metadata from instance class
    const metadata: MetaData = Reflect.getMetadata(ROUTES_KEY, instance);
    // set request handler in router
    metadata.forEach((routes, key) => {
      const middle: RequestHandler[] =
        Reflect.getMetadata(MIDDLE_KEY, instance, key) || [];
      routes.forEach((route) => {
        const { path, method } = route;
        // set request handle
        router[method](path, middle, wrapper(instance[key].bind(instance)));
      });
    });
    // finally return router
    return router;
  });

  return routers;
}
