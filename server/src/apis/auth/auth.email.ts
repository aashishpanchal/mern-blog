import { sendMail } from "@/common/mail";
import { totpHash } from "@/common/helpers";

export class AuthEmail {
  static async sendVerificationEmail(email: string) {
    const { totp, secret } = await totpHash.create(email);

    const context = {
      totp,
      email,
      exp: totpHash.codeExp,
    };

    await sendMail({
      to: email,
      subject: `${totp} is your verification code`,
      context,
      template: "verification",
    });

    // and return the secret
    return secret;
  }

  static async sendWelcomeEmail(email: string, name: string) {
    return await sendMail({
      to: email,
      subject: "Welcome to the blog",
      context: {
        name,
        email,
      },
      template: "welcome",
    });
  }
}
