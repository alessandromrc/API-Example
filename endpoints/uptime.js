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
    app.get('/api/uptime', function (req, res) {
        try {
            res.json({
                uptime: Math.floor(process.uptime()),
            });
        } catch (e) {
            res.status(500);
            return logger.log({ level: 'error', message: e });
        }
    });
};