import config from "@/config";
import { wrapper } from "@/lib/wrapper";
import { AuthService } from "./auth.service";
import { ApiResponse } from "@/lib/response";
import { EmailVerificationSchema, SignupSchema } from "./auth.schema";

export class AuthController {
  private static isDev = config.get("is_dev", true);

  static signin = wrapper(async (req, res) => {
    const user = req.user;
    // generate tokens
    const tokens = await AuthService.getToken(user.id);
    // set token in cookies
    res
      .cookie("refresh", tokens.refresh, {
        maxAge: AuthService.refresh.exp_in,
        httpOnly: this.isDev,
      })
      .cookie("access", tokens.access, {
        maxAge: AuthService.access.exp_in,
        httpOnly: this.isDev,
      });
    // return response with user and tokens
    return ApiResponse.success({ user, tokens }, "User logged in successfully");
  });

  static signup = wrapper(async (req) => {
    const createDto = SignupSchema.parse(req.body);
    // signup user
    const user = await AuthService.signup(createDto);
    // return response with user and secret
    return ApiResponse.created(
      user,
      "Users registered successfully and verification email has been sent on your email."
    );
  });

  static verifyEmail = wrapper(async (req) => {
    const verifyDto = EmailVerificationSchema.parse(req.body);
    const { tokens, user } = await AuthService.verify(verifyDto);
    // set token in cookies
    req.res
      .cookie("refresh", tokens.refresh, {
        maxAge: AuthService.refresh.exp_in,
        httpOnly: this.isDev,
      })
      .cookie("access", tokens.access, {
        maxAge: AuthService.access.exp_in,
        httpOnly: this.isDev,
      });
    // return response with user and tokens
    return ApiResponse.success({ user, tokens }, "User verified successfully");
  });

  static resendEmail = wrapper(async (req) => {
    const { email } = SignupSchema.pick({ email: true }).parse(req.body);
    // send email and get new secret of user
    const secret = await AuthService.resendEmailVerification(email);
    // return response with secret
    return ApiResponse.success(
      { secret },
      "Verification email has been sent on your email."
    );
  });

  static refreshToken = wrapper(async (req, res) => {
    // token get from cookie
    const token = req.body?.token || req.cookies?.refresh;
    const { access } = await AuthService.tokenRefresh(token);
    // set token in cookies
    res.cookie("access", access, {
      maxAge: AuthService.access.exp_in,
      httpOnly: this.isDev,
    });
    // return response with tokens
    return ApiResponse.success(
      { access, refresh: token },
      "Tokens refreshed successfully"
    );
  });

  static logout = wrapper(async (req, res) => {
    // token get from cookie
    const token = req.body?.token || req.cookies?.refresh;
    await AuthService.refresh.blacklisted(token);
    // clear cookies
    res.clearCookie("refresh").clearCookie("access");
    // return response
    return ApiResponse.success(null, "User logged out successfully");
  });
}
