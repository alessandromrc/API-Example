/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable eol-last */
const { categorieutenti } = require('../config/enums');
const logger = require('../utils/logger');


module.exports = function (app) {
    app.get('/api/categorieutenti', function (req, res) {
        try {
            res.send(categorieutenti);
        } catch (e) {
            res.status(500);
            return logger.log({ level: 'error', message: e });
        }
    });
};