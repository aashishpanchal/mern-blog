import ms from 'ms';
import jwt from 'jsonwebtoken';
import { v4 as uuid4 } from 'uuid';
import { defaultsDeep } from 'lodash';
import { config } from '@/config/config.service';
import { BadRequest, Unauthorized } from 'http-errors';
import { TokenBlacklist } from '@/models/token-blacklist.model';

interface JwtOptions {
  exp: string;
  type: string;
  save?: boolean;
  algorithm?: jwt.Algorithm;
}

export class JwtToken {
  declare exp: number;

  constructor(private options: JwtOptions) {
    this.options = defaultsDeep(options, {
      save: false,
      type: 'test',
      algorithm: 'HS512',
    });
    this.exp = ms(this.options.exp);
  }

  async save(payload: jwt.JwtPayload, options?: Partial<TokenBlacklist>) {
    return await TokenBlacklist.create({
      jti: payload['jti'],
      user: payload['sub'],
      expiredAt: new Date(Date.now() + ms(this.options.exp)),
      ...options,
    });
  }

  async isBlacklisted(token: string | jwt.JwtPayload) {
    const payload =
      typeof token === 'string' ? await this.verify(token) : token;

    const tokenBlacklist = await TokenBlacklist.findOne({
      jti: payload['jti'],
    });

    if (!tokenBlacklist) return false;

    return tokenBlacklist.isBlacklisted;
  }

  async blacklisted(token: string) {
    if (this.options.save) {
      // check token is verified
      const payload = await this.verify(token);

      const tokenBlacklist = await TokenBlacklist.findOneAndUpdate(
        { jti: payload['jti'] },
        { isBlacklisted: true, blacklistedAt: new Date() },
        { new: true },
      );

      if (tokenBlacklist === null && this.save)
        await this.save(payload, {
          isBlacklisted: true,
          blacklistedAt: new Date(),
        });

      // finally return payload
      return payload;
    }
    throw new BadRequest(`You can't blacklist of ${this.options.type} token.`);
  }

  async verify(token: string) {
    try {
      const payload = jwt.verify(token, config.getOrThrow('jwt.secret'));
      // check token payload is valid or not
      if (payload['type'] !== this.options.type)
        throw new Unauthorized('Token type is invalid.');

      // check token is blacklisted or not
      if (this.options.save && (await this.isBlacklisted(payload)))
        throw new Unauthorized('Token was blacklisted.');

      return payload as jwt.JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw new Unauthorized('Token is expired');
      if (error instanceof jwt.JsonWebTokenError)
        throw new Unauthorized(error.message);
      throw error;
    }
  }

  async create(user: string) {
    // token unique id
    const jti = uuid4().replaceAll('-', '');
    // payload
    const payload: jwt.JwtPayload = {
      jti,
      sub: user,
      type: this.options.type,
      iss: config.get('jwt.issuer', 'test'),
    };

    // create jwt token
    const token = jwt.sign(payload, config.getOrThrow('jwt.secret'), {
      expiresIn: this.options.exp,
      algorithm: this.options.algorithm,
    });
    // if, user want to save token in database
    if (this.options.save) this.save(payload); /* save token in database */

    return token;
  }
}
