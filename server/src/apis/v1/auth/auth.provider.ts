import { container } from 'tsyringe';
import { JwtToken } from './helpers';
import { config } from '@/config/config.service';

export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';

container.register(ACCESS_TOKEN, {
  useValue: new JwtToken({
    type: 'access',
    exp: config.getOrThrow('jwt.accessExp'),
  }),
});

container.register(REFRESH_TOKEN, {
  useValue: new JwtToken({
    save: true,
    type: 'refresh',
    exp: config.getOrThrow('jwt.refreshExp'),
  }),
});
