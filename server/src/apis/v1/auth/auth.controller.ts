import { auth } from './middlewares';
import { injectable } from 'tsyringe';
import { BadRequest } from 'http-errors';
import { validate } from '@/utils/validate';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { config } from '@/config/config.service';
import { EmailVerifyDto } from './dto/verify.dto';
import { isEmail, isEmpty } from 'class-validator';
import { ApiResponse, Delete, Middleware, Patch, Post } from '@/utils/common';
// types
import type { Request } from 'express';

@injectable()
export class AuthController {
  readonly isDev = config.get('isDev', true);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Middleware(auth.local)
  async login(req: Request) {
    const user = req.user;
    // generate tokens
    const tokens = await this.authService.getToken(user.id);
    // return response with user and tokens
    return ApiResponse.success(
      { user: user.toJSON(), tokens },
      'Logged successfully',
    );
  }

  @Post('register')
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
  async refreshToken(req: Request) {
    // token get
    const token = req.body?.token;
    if (isEmpty(token)) throw new BadRequest('Token field is required');
    const accessToken = await this.authService.tokenRefresh(token);
    // return response with tokens
    return ApiResponse.success(
      { accessToken },
      'Tokens refreshed successfully',
    );
  }

  @Delete('logout')
  @Middleware(auth.jwt)
  async logout(req: Request) {
    // token get
    const token = req.body?.token;
    if (isEmpty(token)) throw new BadRequest('Token field is required');
    await this.authService.refresh.blacklisted(token);
    // return response
    return ApiResponse.success(null, 'User logged out successfully');
  }
}
