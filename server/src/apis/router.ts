import { Router } from "express";
import authRouter from "./auth/auth.router";

export const apiRouter: Router = Router();
// set api router
apiRouter.use("/auth", authRouter);
