import winston from 'winston';
import { configENV } from './config';

/**
 * 
 * Similarly, npm logging levels are prioritized from 0 to 6 (highest to lowest):

{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
 */

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: {
    serviceName: 'template-service',
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      dirname: 'logs',
      filename: 'combined.log',
      level: 'info',
      silent: configENV.nodeEnv === 'test',
    }),
    new winston.transports.File({
      dirname: 'logs',
      filename: 'error.log',
      level: 'error',
      silent: configENV.nodeEnv === 'test',
    }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: configENV.nodeEnv === 'test',
    }),
  ],
});

export default logger;
