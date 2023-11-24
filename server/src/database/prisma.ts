import findById from "./extensions/findById";
import { User as _User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// add extensions
export const db = prisma.$extends(findById);

// change user type in request
declare global {
  namespace Express {
    interface User extends _User {}
  }
}
