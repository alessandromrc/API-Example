/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable eol-last */
const { auth } = require('../middlewares/auth');
const logger = require('../utils/logger');


module.exports = function (app) {
    app.get('/api/logout', auth, function (req, res) {
        try {
            req.user.deleteToken(req.token, (err) => {
                if (err) {
                    logger.log({ level: 'error', message: err });
                    return res.sendStatus(500);
                }
                res.sendStatus(200);
            });
        } catch (e) {
            return logger.log({ level: 'error', message: e });
        }
    });
};