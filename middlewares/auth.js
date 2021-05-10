/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
const User = require('./../models/user');
const logger = require('./../utils/logger');

const auth = (req, res, next) => {
    try {
        const token = req.cookies.auth;
        User.findByToken(token, (err, user) => {
            if (err) {
                logger.log({ level: 'error', message: err });
                throw err;
            }
            if (!user) {
                return res.json({
                    error: true,
                });
            }
            req.token = token;
            req.user = user;
            next();
        });
    } catch (e) {
        return logger.log({ level: 'error', message: e });
    }
};

module.exports = {
    auth,
};