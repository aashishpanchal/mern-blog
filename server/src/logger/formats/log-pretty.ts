import chalk from 'chalk';
import { logError } from './log-error';
import { format, Logform } from 'winston';

const Color: Record<string, (text: string) => string> = {
  info: chalk.green,
  error: chalk.bgRed,
  warn: chalk.yellow,
  debug: chalk.magentaBright,
  verbose: chalk.cyanBright,
};

const defaultTimestampFormat = 'DD/MM/YYYY hh:mm:ss A';

/**
 * Create a pretty print formatter for a winston logger
 * @param options
 */
export function prettyPrint() {
  const handlers: Logform.Format[] = [];

  handlers.push(format.timestamp({ format: defaultTimestampFormat }));

  handlers.push(logError());

  handlers.push(
    format.printf(({ level, message, timestamp }) => {
      const color = Color[level] || ((text: string): string => text);

      return `[${timestamp}] ${color(`${level.toUpperCase()}`)} (${
        process.env.NAME || 'App'
      }) ${message}`;
    }),
  );

  return format.combine(...handlers);
}
