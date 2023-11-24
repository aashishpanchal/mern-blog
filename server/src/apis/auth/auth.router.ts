import passport from "passport";
import { Router } from "express";
import { auth } from "./middlewares";
import { AuthController } from "./auth.controller";
import { JwtStrategy, LocalStrategy } from "./strategies";

// initialize passport strategies
passport.use("jwt", JwtStrategy);
passport.use("local", LocalStrategy);
// create auth router
const router: Router = Router();
// make router from controller class
router.route("/signup").post(AuthController.signup);
router.route("/signin").post(auth.local, AuthController.signin);
router.route("/logout").delete(auth.jwt, AuthController.logout);
router.route("/verify-email").post(AuthController.verifyEmail);
router.route("/resend-email").post(AuthController.resendEmail);
router.route("/refresh-token").post(auth.jwt, AuthController.refreshToken);

export default router;
