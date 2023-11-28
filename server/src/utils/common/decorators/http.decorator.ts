import { ROUTES_KEY } from '../constants';
import type { IRoute } from 'express';
import type { MetaData, RoutesType } from '../interface';

const common =
  (method: keyof IRoute) =>
  (...path: string[]) => {
    if (path.length === 0) path = ['/'];
    else path = path.map((p) => (p.startsWith('/') ? p : `/${p}`));

    return (target: any, propertyKey: string) => {
      let metadata: MetaData =
        Reflect.getMetadata(ROUTES_KEY, target) || new Map();

      if (metadata.has(propertyKey)) {
        const routes: RoutesType = metadata.get(propertyKey);
        // add new path
        const index = routes.findIndex((r) => r.method === method);

        if (index !== -1) {
          // check path already exit or not
          const oldPath = routes[index].path;
          // merge old path and new path
          if (oldPath) path = [...oldPath, ...path];
          // add paths routes on index
          routes[index].path = path;
        } else routes.push({ path, method });
        // update data
        metadata.set(propertyKey, routes);
      } else {
        // set new property
        metadata.set(propertyKey, [{ path, method }]);
      }
      // update metadata
      Reflect.defineMetadata(ROUTES_KEY, metadata, target);
    };
  };

// Decorator functions
export const Post = common('post');
export const Get = common('get');
export const Put = common('put');
export const All = common('all');
export const Delete = common('delete');
export const Patch = common('patch');
