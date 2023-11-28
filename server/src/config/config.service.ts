import { Config } from '@/utils/config';
import { AppConfig } from './app.config';

export const config = new Config({
  loads: AppConfig,
});
