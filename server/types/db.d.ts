import { Types } from 'mongoose';

declare global {
  type Ref<T> = Types.ObjectId | T;
}
