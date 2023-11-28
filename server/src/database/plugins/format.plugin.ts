import type { Schema } from 'mongoose';

export const Formate = (schema: Schema) =>
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret, options) {
      const id = ret._id;
      delete ret._id;
      return { id, ...ret };
    },
  });
