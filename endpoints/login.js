/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable eol-last */
/* eslint-disable indent */
const User = require('../models/user');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('../utils/logger');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true,
    }));
    app.use(cookieParser());
    app.post('/api/login', function (req, res) {
        try {
            const token = req.cookies.auth;
            User.findByToken(token, (err, user) => {
                if (err) {
                    logger.log({ level: 'error', message: err });
                    return res.sendStatus(404);
                }
                if (user) {
                    return res.status(400).json({
                        error: true,
                        message: 'You\'re already logged in',
                    });
                } else {
                    User.findOne({
                        email: req.body.email,
                    }, function (err, user) {
                        if (err) {
                            logger.log({ level: 'error', message: err });
                            return res.sendStatus(404);
                        }
                        if (!user) {
                            return res.json({
                                isAuth: false,
                                message: 'Auth failed, email not found',
                            });
                        }

                        user.comparepassword(req.body.password, (err, isMatch) => {
                            if (err) {
                                logger.log({ level: 'error', message: err });
                                return res.sendStatus(404);
                            }
                            if (!isMatch) {
                                return res.json({
                                    isAuth: false,
                                    message: 'The password doesn\'t match',
                                });
                            }

                            user.generateToken((err, user) => {
                                if (err) {
                                    logger.log({ level: 'error', message: err });
                                    return res.sendStatus(404);
                                }
                                res.cookie('auth', user.token).json({
                                    isAuth: true,
                                    id: user._id,
                                    email: user.email,
                                });
                            });
                        });
                    });
                }
            });
        } catch (e) {
            return logger.log({ level: 'error', message: e });
        }
    });
};