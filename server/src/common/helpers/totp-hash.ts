import ms from "ms";
import config from "@/config";
import speakeasy from "speakeasy";

export class TotpHash {
  declare codeExp: number;

  constructor() {
    this.codeExp = ms(config.getOrThrow<string>("totp_exp")) / 1000; // in seconds;
  }

  public async create(label: string, digits = 6) {
    const issuer = config.get("name", "test");

    const secret = speakeasy.generateSecret({
      length: 20,
      name: label,
      issuer,
    }).base32;

    const totp = speakeasy.totp({
      secret: secret,
      step: this.codeExp,
      encoding: "base32",
      digits,
    });

    return { totp, secret };
  }

  public async verify(totp: string, secret: string): Promise<boolean> {
    return speakeasy.totp.verify({
      secret,
      token: totp,
      step: this.codeExp,
      encoding: "base32",
    });
  }
}

export const totpHash = new TotpHash();
