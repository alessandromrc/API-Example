/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
const logger = require('../utils/logger');
const qr = require('qr-image');

module.exports = function (app) {
    app.get('/api/qrcode', function (req, res) {
        try {
            const data = req.body.data;
            if (data != null) {
                const code = qr.image(data, { type: 'png' });
                res.setHeader('Content-type', 'image/png');
                code.pipe(res);
            } else {
                res.status(500);
                res.json('You didn\'t sent any data!');
            }
        } catch (e) {
            return logger.log({ level: 'error', message: e });
        }
    });
};