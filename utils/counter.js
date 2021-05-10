/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

const logger = require('./logger');
module.exports = function (app) {
    const ten_min = 600000;
    const count = [0];
    function countMiddleware(req, res, next) {
        count.push((count.length - 1) + 1);
        const refresh = setInterval(function () {
            count.splice(0, count.length);
        }, ten_min);
        function stopFunction() {
            clearInterval(refresh);
        }
        if (next) next();
        const Sparkline = require('clui').Sparkline;
        console.log(Sparkline(count, ' requests'));
        logger.info((count.length - 1) + ' requests/10Min');
    }
    app.use(countMiddleware);
};