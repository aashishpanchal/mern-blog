import { db } from "@/database";
import { compare } from "bcrypt";
import { Strategy } from "passport-local";
import { Unauthorized, Forbidden, NotFound } from "http-errors";

export const LocalStrategy = new Strategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username: string, password: string, done) => {
    try {
      const user = await db.user.findFirst({
        where: {
          OR: [{ email: username }, { username }],
        },
      });

      if (!user) throw new NotFound("User account not found.");

      if (!(await compare(password, user.password)))
        throw new Unauthorized("given credentials are invalid.");

      if (user.isBlocked) throw new Forbidden("User account is blocked.");

      // update user login time
      await db.user.update({
        where: { id: user.id },
        data: { loginAt: new Date() },
      });

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);
