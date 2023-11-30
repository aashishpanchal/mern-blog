import { ApiResponse, Get, Post } from '@/utils/common';
import type { Request } from 'express';
import { injectable } from 'tsyringe';

@injectable()
export class BlogController {
  @Post()
  async createBlog(req: Request) {
    return ApiResponse.created(req.body);
  }

  @Get()
  async getBlogs() {
    return ApiResponse.success('These are blog-app.');
  }

  @Get('/:id')
  async getBlogById() {
    return ApiResponse.success('This is blog-app.');
  }
}
