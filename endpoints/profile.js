/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
const { auth } = require('../middlewares/auth');
const logger = require('../utils/logger');

module.exports = function (app) {
    app.get('/api/profile', auth, function (req, res) {
        try {
            res.json({
                isAuth: true,
                id: req.user._id,
                email: req.user.email,
                name: req.user.firstname + ' ' + req.user.lastname,
            });
        } catch (e) {
            return logger.log({ level: 'error', message: e });
        }
    });
};