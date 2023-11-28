import { Request } from 'express';
import { injectable } from 'tsyringe';
import { auth } from '../auth/middlewares';
import { UserService } from './user.service';
import { ApiResponse, Get, Middleware, Post } from '@/utils/common';

@injectable()
@Middleware(auth.jwt)
export class UserController {
  constructor(readonly userService: UserService) {}

  @Get('me')
  async me(req: Request) {
    const user = req.user;
    return ApiResponse.success(user.toJSON(), 'User data fetched successfully');
  }

  @Post('upload-avatar')
  async uploadAvatar(req: Request) {
    return ApiResponse.success('success fully upload user avatar.');
  }

  @Post('update-profile')
  async updateProfile(req: Request) {
    return ApiResponse.success('success fully update user profile.');
  }
}
