/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable max-len */

const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf((info) => `${'[' + info.timestamp} | ${info.level + ']'} ${info.message}`),
    ),
    transports: [
        new transports.File({
            filename: './logs/server.log',
            json: false,
            maxFiles: 5,
        }),
        new transports.Console(),
    ],
});

module.exports = logger;