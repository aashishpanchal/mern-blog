import ms from 'ms';
import speakeasy from 'speakeasy';
import { injectable } from 'tsyringe';
import { config } from '@/config/config.service';

@injectable()
export class TotpHash {
  readonly codeExp = ms(config.getOrThrow<string>('totpExp')) / 1000;

  create(label: string, digits = 6) {
    const issuer = config.get('name', 'test');

    const secret = speakeasy.generateSecret({
      length: 20,
      name: label,
      issuer,
    }).base32;

    const totp = speakeasy.totp({
      secret: secret,
      step: this.codeExp,
      encoding: 'base32',
      digits,
    });

    return { totp, secret };
  }

  public verify(totp: string, secret: string, digits = 6) {
    return speakeasy.totp.verify({
      secret,
      token: totp,
      step: this.codeExp,
      encoding: 'base32',
      digits,
    });
  }
}
