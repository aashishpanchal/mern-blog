import ms from "ms";
import config from "@/config";
import jwt from "jsonwebtoken";
import { db } from "@/database";
import { v4 as uuid4 } from "uuid";
import { defaultsDeep } from "lodash";
import { Unauthorized, BadRequest } from "http-errors";
// types
import type { TokenBlacklist } from "@prisma/client";
interface JwtOptions {
  exp: string;
  type: string;
  save?: boolean;
  algorithm?: jwt.Algorithm;
}

// jwt token class
class JwtToken {
  declare options: JwtOptions;
  declare exp_in: number;

  constructor(options: JwtOptions) {
    this.options = defaultsDeep(options, {
      save: false,
      type: "test",
      algorithm: "HS512",
    });
    this.exp_in = ms(this.options.exp);
  }

  async save(payload: jwt.JwtPayload, options?: Partial<TokenBlacklist>) {
    return await db.tokenBlacklist.create({
      data: {
        jti: payload["jti"],
        userId: payload["sub"],
        expired_at: new Date(Date.now() + ms(this.options.exp)),
        ...options,
      },
    });
  }

  async isBlacklisted(token: string | jwt.JwtPayload) {
    const payload =
      typeof token === "string" ? await this.verify(token) : token;

    const tokenBlacklist = await db.tokenBlacklist.findUnique({
      where: { jti: payload["jti"] },
    });

    if (!tokenBlacklist) return false;

    return tokenBlacklist.is_blacklisted;
  }

  async blacklisted(token: string) {
    if (this.options.save) {
      // check token is verified
      const payload = await this.verify(token);

      const { count } = await db.tokenBlacklist.updateMany({
        where: { jti: payload["jti"] },
        data: { is_blacklisted: true, blacklisted_at: new Date() },
      });

      if (count === 0 && this.save)
        await this.save(payload, {
          is_blacklisted: true,
          blacklisted_at: new Date(),
        });

      // finally return payload
      return payload;
    }
    throw new BadRequest(`You can't blacklist of ${this.options.type} token.`);
  }

  async verify(token: string) {
    try {
      const payload = jwt.verify(token, config.getOrThrow("jwt.secret"));
      // check token payload is valid or not
      if (payload["type"] !== this.options.type)
        throw new Unauthorized("Token type is invalid.");

      // check token is blacklisted or not
      if (this.options.save && (await this.isBlacklisted(payload)))
        throw new Unauthorized("Token was blacklisted.");

      return payload as jwt.JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw new Unauthorized("Token is expired");
      if (error instanceof jwt.JsonWebTokenError)
        throw new Unauthorized(error.message);
      throw error;
    }
  }

  async create(user: string) {
    // token unique id
    const jti = uuid4();

    // payload
    const payload: jwt.JwtPayload = {
      jti,
      sub: user,
      type: this.options.type,
      iss: config.get("jwt.issuer", "test"),
    };

    // create jwt token
    const token = jwt.sign(payload, config.getOrThrow("jwt.secret"), {
      expiresIn: this.options.exp,
      algorithm: this.options.algorithm,
    });
    // if, user want to save token in database
    if (this.options.save) this.save(payload); /* save token in database */

    return token;
  }
}

export default JwtToken;
