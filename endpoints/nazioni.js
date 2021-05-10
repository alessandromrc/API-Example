/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable eol-last */
const { Nazioni } = require('../config/enums');
const logger = require('../utils/logger');


module.exports = function (app) {
    app.get('/api/nazioni', function (req, res) {
        try {
            res.send(Nazioni);
        } catch (e) {
            res.status(500);
            return logger.log({ level: 'error', message: e });
        }
    });
};