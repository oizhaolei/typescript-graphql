import fs from 'fs';
import log4js, { Logger } from 'log4js';

// logs dir
const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

log4js.configure({
  appenders: {
    stdout: {
      type: 'stdout',
    },
    demo: {
      type: 'dateFile',
      filename: `${logDir}/demo.log`,
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ['stdout', 'demo'],
      level: 'debug',
    },
  },
});

export default (name: string): Logger => {
  const logger = log4js.getLogger(name);
  logger.level = 'debug';
  return logger;
};
