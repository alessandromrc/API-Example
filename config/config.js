/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable eol-last */
const logger = require('../utils/logger');

const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI,
    },
    default: {
        SECRET: 'mysecretkey',
        DATABASE: 'mongodb://localhost:27017/Users',
    },
};

exports.get = function get(env) {
    try {
        return config[env] || config.default;
    } catch (e) {
        return logger.log({ level: 'error', message: e });
    }
};