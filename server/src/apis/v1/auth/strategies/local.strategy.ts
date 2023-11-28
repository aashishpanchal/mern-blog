import { container } from 'tsyringe';
import { Forbidden } from 'http-errors';
import { Strategy } from 'passport-local';
import { validate } from '@/utils/validate';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../auth.service';

export const LocalStrategy = new Strategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username: string, password: string, done) => {
    try {
      const authService = container.resolve(AuthService);
      // validate now
      const loginDto = await validate(LoginDto, { username, password });
      // check user is validate or not
      let user = await authService.validateUser(loginDto);
      // check user account is blocked
      if (user.isBlocked) throw new Forbidden('User account is blocked.');

      // update user login time
      user = await user.updateLoginAt();

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);
