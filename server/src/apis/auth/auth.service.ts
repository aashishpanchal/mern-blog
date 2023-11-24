import config from "@/config";
import { db } from "@/database";
import { JwtToken } from "./helper";
import { Hash } from "@/common/hash";
import { Conflict } from "http-errors";
import { AuthEmail } from "./auth.email";
import { totpHash } from "@/common/helpers";
import type { EmailVerificationSchema, SignupSchema } from "./auth.schema";

export class AuthService {
  // refresh token
  static refresh = new JwtToken({
    save: true,
    type: "refresh",
    exp: config.getOrThrow("jwt.refresh_exp"),
  });
  // access token
  static access = new JwtToken({
    type: "access",
    exp: config.getOrThrow("jwt.access_exp"),
  });

  static async signup(createDto: SignupSchema) {
    const { email } = createDto;
    // check if user already exists
    const user = await db.user.findUnique({ where: { email } });
    // if user already exists after throw error
    if (user) throw new Conflict("User account already exists with email.");
    // make data to save in database
    const data: any = Object.assign(createDto, {
      username: await Hash.genUsername(email),
      password: await Hash.makePassword(createDto.password),
      isEmailVerified: false,
    });
    // create a new user
    return await db.user.create({ data }).then(async (res) => ({
      ...res,
      // send verification email to the user's email address
      secret: await AuthEmail.sendVerificationEmail(res.email),
    }));
  }

  static async verify(verifyDto: EmailVerificationSchema) {
    const { totp, secret } = verifyDto;
    // check totp is valid or not
    const isValid = totpHash.verify(totp, secret);
    // if totp is not valid throw error
    if (!isValid) throw new Conflict("Invalid TOTP");
    // if totp is valid update user isEmailVerified to true and return tokens and user data.
    try {
      const user = await db.user.update({
        where: { email: verifyDto.email },
        data: { isEmailVerified: true },
      });
      // send welcome email after verification complete
      await AuthEmail.sendWelcomeEmail(user.email, user.fullname);
      return { tokens: await this.getToken(user.id), user };
    } catch (error) {
      // if user is not found throw error.
      throw new Conflict("User not found");
    }
  }

  static async resendEmailVerification(email: string) {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) throw new Conflict("User does not exists");
    // if email is already verified throw error
    if (user.isEmailVerified) throw new Conflict("Email is already verified");
    // send verification email to the user's email address
    return await AuthEmail.sendVerificationEmail(user.email);
  }

  static async getToken(user: string) {
    const [refresh, access] = await Promise.all([
      this.refresh.create(user),
      this.access.create(user),
    ]);
    return { refresh, access };
  }

  static async tokenRefresh(token: string) {
    const { sub } = await this.refresh.verify(token);
    const access = await this.access.create(sub);
    return { access };
  }
}
