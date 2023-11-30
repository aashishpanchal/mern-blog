import passport from 'passport';
import { Router } from 'express';
import { getRouterForClass } from '@/utils/common';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { BlogController } from './blog/blog.controller';
import { JwtStrategy, LocalStrategy } from './auth/strategies';

// strategies configs
passport.use('jwt', JwtStrategy);
passport.use('local', LocalStrategy);
// make v1 router
export const v1Router: Router = Router();
// api router are init
v1Router.use('/auth', getRouterForClass(AuthController));
v1Router.use('/user', getRouterForClass(UserController));
v1Router.use('/blog', getRouterForClass(BlogController));
