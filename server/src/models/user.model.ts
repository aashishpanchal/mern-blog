import { compare, hash } from 'bcrypt';
import { Schema, model } from 'mongoose';
import type { InferSchemaType, HydratedDocument } from 'mongoose';

const schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullname: String,
    password: String,
    avatar: String,
    isBlocked: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    loginAt: Date,
  },
  { timestamps: true },
);

// middleware
schema.pre('save', async function (next) {
  if (this.password) {
    if (!this?.isModified('password')) return next();
    this.password = await hash(this.password, 10);
  }
  next();
});
// methods
schema.method('checkPassword', async function (password: string) {
  if (this.password) return await compare(password, this.password);
  return false;
});
schema.method('updateLoginAt', async function () {
  this.loginAt = new Date();
  return await this.save();
});
// user-model
export const User = model<User>('User', schema);

// types
export interface User extends InferSchemaType<typeof schema> {
  checkPassword(password: string): Promise<boolean>;
  updateLoginAt(): Promise<UserDocument>;
}
export type UserDocument = HydratedDocument<User>;
// make global user in request
declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}
