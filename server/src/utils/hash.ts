import { v4 as uuid4 } from 'uuid';
import { User } from '@/models/user.model';

export class Hash {
  static nanoid(size: number = 10) {
    return uuid4().replace(/-/g, '').slice(0, size);
  }

  // you can easily generate user name using this static method
  static async username(email: string) {
    let username = email.split('@')[0];

    let isUsernameNotUnique = await User.findOne({ username });

    isUsernameNotUnique ? (username += this.nanoid(5)) : '';

    return username;
  }
}
