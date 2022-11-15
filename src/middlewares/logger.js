const expressWinston = require('express-winston');
const winston = require('winston');

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.json' })],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.json' })],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
