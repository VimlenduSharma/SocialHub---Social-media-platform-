import pino, { transport } from 'pino';
const pinoHttp: any = require('pino-http');

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? 'info',
    base: { pid: false },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  !isProd
    ? transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      })
    : undefined
);
export const httpLogger = pinoHttp({ logger });
