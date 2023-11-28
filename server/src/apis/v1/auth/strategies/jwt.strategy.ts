import { User } from '@/models/user.model';
import { config } from '@/config/config.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Unauthorized, Forbidden, NotFound } from 'http-errors';

export const JwtStrategy = new Strategy(
  {
    secretOrKey: config.getOrThrow<string>('jwt.secret'),
    jwtFromRequest: (req) => {
      let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      // check token is empty and may token inside cookie
      if (!token) token = req.cookies?.access;
      return token;
    },
  },
  async (payload, done) => {
    try {
      const { sub } = payload;

      if (payload.type !== 'access')
        throw new Unauthorized('Token type is invalid.');

      const user = await User.findById(sub);

      if (!user) throw new NotFound('User account not found.');

      if (user.isBlocked) throw new Forbidden('User account is blocked');

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);
