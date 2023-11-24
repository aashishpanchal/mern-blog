// async catch error wrapper
import { Response, NextFunction, RequestHandler } from "express";
import { ApiResponse } from "./response";

// for function
export function wrapper(fn: RequestHandler) {
  const callback = function (this: any, ...args: any[]) {
    const next: NextFunction = args[args.length - 1];
    const res: Response = args.length > 3 ? args[2] : args[1];
    Promise.resolve(fn.apply(this, args))
      .then((instance) => {
        if (instance instanceof ApiResponse) {
          res.status(instance.statusCode).json(instance);
        }
        // check data if exist or not
        else if (instance && instance !== res) return res.send(instance);
      })
      .catch(next);
  };

  return callback;
}
