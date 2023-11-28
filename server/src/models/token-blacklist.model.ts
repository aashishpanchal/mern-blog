import { Schema, model } from 'mongoose';
import type { InferSchemaType } from 'mongoose';
import type { UserDocument } from './user.model';

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jti: { type: String, required: true, unique: true },
  isBlacklisted: { type: Boolean, default: false },
  expiresAt: Date,
  blacklistedAt: Date,
});

// make user-model
export const TokenBlacklist = model<TokenBlacklist>('TokenBlacklist', schema);
// types
export type TokenBlacklist = InferSchemaType<typeof schema> & {
  user: Ref<UserDocument>;
};
