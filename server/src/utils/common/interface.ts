import { IRoute, RequestHandler } from "express";

export type RoutesType = Array<{
  path: string[];
  method: keyof IRoute;
}>;

export type MetaData = Map<string, RoutesType>;

export type Options = {
  middle: [{ match: RegExp; func: RequestHandler[] | RequestHandler }];
};
