import { Hash } from '@/utils/hash';
import { Conflict } from 'http-errors';
import { User } from '@/models/user.model';
import { injectable, inject } from 'tsyringe';
import { AuthEmail, JwtToken } from './helpers';
import { TotpHash } from '@/helpers/totp.helper';
import { Unauthorized, NotFound } from 'http-errors';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './auth.provider';
// types
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type { EmailVerifyDto } from './dto/verify.dto';

@injectable()
export class AuthService {
  constructor(
    readonly totpHash: TotpHash,
    readonly authEmail: AuthEmail,
    @inject(ACCESS_TOKEN) readonly access: JwtToken,
    @inject(REFRESH_TOKEN) readonly refresh: JwtToken,
  ) {}

  async validateUser({ username, password }: LoginDto) {
    const user = await User.findOne({
      $or: [{ email: username }, { username }],
    });

    if (!user) throw new NotFound('User account not found.');

    if (!(await user.checkPassword(password)))
      throw new Unauthorized('Invalid credentials.');

    return user;
  }

  async register(registerDto: RegisterDto) {
    const { email } = registerDto;
    // check if user already exists
    const user = await User.findOne({ email });
    // if user already exists after throw error
    if (user) throw new Conflict('User account already exists with email.');
    // make data to save in database
    const data = Object.assign(registerDto, {
      username: await Hash.username(email),
      isEmailVerified: false,
    });
    // create a new user
    return await User.create(data).then(async (res) => {
      // send verification email to the user's email address
      const secret = await this.authEmail.sendVerifyEmail(res.email);
      // return secret and user data
      return { secret, user: res.toJSON() };
    });
  }

  async verifyEmail(verifyDto: EmailVerifyDto) {
    const { totp, secret } = verifyDto;
    // check totp is valid or not
    const isValid = this.totpHash.verify(totp, secret);
    // if totp is not valid throw error
    if (!isValid) throw new Conflict('Invalid otp and may be expire.');
    // if totp is valid update user isEmailVerified to true and return tokens and user data.
    const user = await User.findOneAndUpdate(
      { email: verifyDto.email, isEmailVerified: false },
      { isEmailVerified: true },
      { new: true },
    );
    if (!user) throw new Conflict('User does not exists');
    // send welcome email after verification complete
    await this.authEmail.sendWelcomeEmail(user.email, user.fullname);
    return { tokens: await this.getToken(user.id), user };
  }

  async resendVerifyEmail(email: string) {
    const user = await User.findOne({ email });

    if (!user) throw new Conflict('User does not exists');
    // if email is already verified throw error
    if (user.isEmailVerified) throw new Conflict('Email is already verified');
    // send verification email to the user's email address
    return await this.authEmail.sendVerifyEmail(user.email);
  }

  async getToken(user: string) {
    const [refresh, access] = await Promise.all([
      this.refresh.create(user),
      this.access.create(user),
    ]);
    return { refresh, access };
  }

  async tokenRefresh(token: string) {
    const { sub } = await this.refresh.verify(token);
    const access = await this.access.create(sub.toString());
    return { access };
  }
}
