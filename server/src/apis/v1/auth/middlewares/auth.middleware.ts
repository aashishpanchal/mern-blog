import passport from 'passport';
import { wrapper } from '@/utils/common';
import { validate } from '@/utils/validate';
import { LoginDto } from '../dto/login.dto';

export const jwt = wrapper((req, res, next) => {
  // check token is valid or not
  const auth = passport.authenticate('jwt', {
    session: false,
  });
  // call passport auth middleware
  return auth(req, res, next);
});

export const local = wrapper(async (req, res, next) => {
  // check user credentials
  req.body = await validate(LoginDto, req.body);
  // check user is valid or not
  const auth = passport.authenticate('local', { session: false });
  // call passport auth middleware
  return auth(req, res, next);
});
