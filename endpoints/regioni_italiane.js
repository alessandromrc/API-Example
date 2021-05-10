/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable eol-last */

const { RegioniItaliane } = require('../config/enums');
const logger = require('../utils/logger');

module.exports = function (app) {
    app.get('/api/regioniitaliane', function (req, res) {
        try {
            res.send(RegioniItaliane);
        } catch (e) {
            return logger.log({ level: 'error', message: e });
        }
    });
};