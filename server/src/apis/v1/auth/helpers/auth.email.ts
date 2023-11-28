import { injectable } from 'tsyringe';
import { sendMail } from '@/helpers/mail.helper';
import { TotpHash } from '@/helpers/totp.helper';

@injectable()
export class AuthEmail {
  constructor(private readonly totpHash: TotpHash) {}

  async sendVerifyEmail(email: string) {
    const { totp, secret } = this.totpHash.create(email);

    const context = {
      totp,
      email,
      exp: this.totpHash.codeExp,
    };

    await sendMail({
      to: email,
      subject: `${totp} is your verification code`,
      context,
      template: 'verification',
    });

    // and return the secret
    return secret;
  }

  async sendWelcomeEmail(email: string, name: string) {
    return await sendMail({
      to: email,
      subject: 'Welcome to the blog',
      context: {
        name,
        email,
      },
      template: 'welcome',
    });
  }
}
