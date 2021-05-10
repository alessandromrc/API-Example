/* eslint-disable linebreak-style */
/* eslint-disable prefer-const */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable eol-last */

const logger = require('../utils/logger');
const process = require('process');

module.exports = function (app) {
    app.get('/api/freemem', function (req, res) {
        try {
            res.json({
                freemem: parseFloat(((process.memoryUsage().heapTotal - process.memoryUsage().heapUsed) / (1024 * 1024)).toFixed(2)),
            });
        } catch (e) {
            res.status(500);
            return logger.log({ level: 'error', message: e });
        }
    });
};