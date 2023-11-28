import * as winston from 'winston';
import * as constants from './logger.constants';
import { prettyPrint } from './formats/log-pretty';

export const logger = winston.createLogger({
  level: constants.LEVEL_LABEL,
  levels: constants.LEVELS,
  format: prettyPrint(),
  transports: [new winston.transports.Console()],
});
