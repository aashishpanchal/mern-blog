import 'reflect-metadata';
import http from 'http';
import chalk from 'chalk';
import { App } from './app';
import { config } from './config/config.service';
import { logger } from './logger/logger.service';

async function main(): Promise<void> {
  const app = await App();
  const server = http.createServer(app);
  // get port and host from config
  const port: number = config.getOrThrow('port');
  const host: string = config.getOrThrow('host');
  // server start
  server.listen(port, host, () =>
    logger.info(`Server Listening on ${chalk.cyan(`http://${host}:${port}`)}`),
  );
}

main();
