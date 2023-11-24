import nanoid from "@/lib/nanoid";
import { db } from "@/database";
import { hash, compare } from "bcrypt";

export class Hash {
  // you can easily generate user name using this static method
  static async genUsername(email: string) {
    let username = email.split("@")[0];

    let unique = await db.user.findUnique({ where: { username } });

    unique ? (username += nanoid(5)) : "";

    return username;
  }

  static async makePassword(password: string) {
    return await hash(password, 10);
  }

  static async checkPassword(hash: string, password: string) {
    return await compare(password, hash);
  }
}
