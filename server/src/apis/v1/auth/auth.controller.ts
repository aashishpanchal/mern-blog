import { auth } from './middlewares';
import { injectable } from 'tsyringe';
import { BadRequest } from 'http-errors';
import { Request, Response } from 'express';
import { validate } from '@/utils/validate';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { config } from '@/config/config.service';
import { EmailVerifyDto } from './dto/verify.dto';
import { isEmail, isEmpty } from 'class-validator';
import { ApiResponse, Delete, Middleware, Patch, Post } from '@/utils/common';

@injectable()
export class AuthController {
  readonly isDev = config.get('isDev', true);

  constructor(private readonly authService: AuthService) {}

  @Post('login', 'signin')
  @Middleware(auth.local)
  async login(req: Request, res: Response) {
    const user = req.user;
    // generate tokens
    const tokens = await this.authService.getToken(user.id);
    // set token in cookies
    res
      .cookie('refresh', tokens.refresh, {
        maxAge: this.authService.refresh.exp,
        httpOnly: this.isDev,
      })
      .cookie('access', tokens.access, {
        maxAge: this.authService.access.exp,
        httpOnly: this.isDev,
      });
    // return response with user and tokens
    return ApiResponse.success({ user, tokens }, 'User logged in successfully');
  }

  @Post('register', 'signup')
  async register(req: Request) {
    const createDto = await validate(RegisterDto, req.body);
    // signup user
    const user = await this.authService.register(createDto);
    // return response with user and secret
    return ApiResponse.created(
      user,
      'Users registered successfully and verification email has been sent on your email.',
    );
  }

  @Post('verify-email')
  async verifyEmail(req: Request) {
    const verifyDto = await validate(EmailVerifyDto, req.body);
    const { tokens, user } = await this.authService.verifyEmail(verifyDto);
    // set token in cookies
    req.res
      .cookie('refresh', tokens.refresh, {
        httpOnly: this.isDev,
        maxAge: this.authService.refresh.exp,
      })
      .cookie('access', tokens.access, {
        httpOnly: this.isDev,
        maxAge: this.authService.access.exp,
      });
    // return response with user and tokens
    return ApiResponse.success({ user, tokens }, 'User verified successfully');
  }

  @Post('resend-email')
  async resendVerifyEmail(req: Request) {
    const { email } = req.body;
    if (isEmpty(email)) throw new BadRequest('Email field is required');
    else if (!isEmail(email)) throw new BadRequest('Invalid email address');
    // send email and get new secret of user
    const secret = await this.authService.resendVerifyEmail(email);
    // return response with secret
    return ApiResponse.success(
      { secret },
      'Verification email has been sent on your email.',
    );
  }

  @Patch('refresh-token')
  async refreshToken(req: Request, res: Response) {
    // token get from cookie
    const token = req.body?.token || req.cookies?.refresh;
    if (isEmpty(token)) throw new BadRequest('Token field is required');
    const { access } = await this.authService.tokenRefresh(token);
    // set token in cookies
    res.cookie('access', access, {
      maxAge: this.authService.access.exp,
      httpOnly: this.isDev,
    });
    // return response with tokens
    return ApiResponse.success({ access }, 'Tokens refreshed successfully');
  }

  @Delete('logout')
  @Middleware(auth.jwt)
  async logout(req: Request, res: Response) {
    // token get from cookie
    const token = req.body?.token || req.cookies?.refresh;
    if (isEmpty(token)) throw new BadRequest('Token field is required');
    await this.authService.refresh.blacklisted(token);
    // clear cookies
    res.clearCookie('refresh').clearCookie('access');
    // return response
    return ApiResponse.success(null, 'User logged out successfully');
  }
}
