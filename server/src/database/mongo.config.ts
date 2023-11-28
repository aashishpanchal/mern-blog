import mongoose from 'mongoose';
import { config } from '@/config/config.service';
import { Formate } from './plugins/format.plugin';

// connect to database
class MongoConfig {
  constructor() {
    mongoose.plugin(Formate);
    mongoose.plugin(require('mongoose-autopopulate'));
  }

  async $connect() {
    const uri = config.getOrThrow<string>('dbUrl');
    // connection start
    const instance = await mongoose.connect(uri, {
      autoIndex: true,
    });
    // on exit to close mongodb server
    process.on('SIGTERM', () => {
      instance.connection.close();
      process.exit(1);
    });
  }
}

export const db = new MongoConfig();
