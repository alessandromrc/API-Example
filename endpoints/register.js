/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
const { passwordsemplici, categorieutenti, RegioniItaliane } = require('../config/enums.js');
const User = require('../models/user');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('../utils/logger');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true,
    }));
    app.use(cookieParser());
    app.post('/api/register', function (req, res) {
        try {
            const newuser = new User(req.body);
            // * Controlla che le due password siano identiche
            if (newuser.password != newuser.password2) {
                return res.status(400).json({
                    success: false,
                    reason: 'La password di conferma è errata!',
                });
            } else {
                // * Controlla che la password non sia banale dalla lista
                if (passwordsemplici.includes(newuser.password)) {
                    res.status(400).json({
                        success: false,
                        reason: 'La password è troppo semplice!',
                    });
                } else {
                    // * Controlla se la categoria inserita è valida
                    if (categorieutenti.includes(newuser.categoria)) {
                        // * Controlla se la data di nascita è valida
                        const regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
                        if (regex.test(newuser.data_di_nascita)) {
                            if (RegioniItaliane.includes(newuser.regione)) {
                                User.findOne({
                                    email: newuser.email,
                                }, function (user) {
                                    if (user) {
                                        return res.status(400).json({
                                            auth: false,
                                            message: 'Email già esistente nel database',
                                        });
                                    }
                                    newuser.save((err, doc) => {
                                        if (err) {
                                            return res.status(400).json({
                                                success: false,
                                                reason: 'L\'account è già esistente.',
                                            });
                                        }
                                        res.status(200).json({
                                            success: true,
                                            user: doc,
                                        });
                                    });
                                });
                            } else {
                                res.status(400).json({
                                    success: false,
                                    reason: 'Regione non valida',
                                });
                            }
                        } else {
                            res.status(400).json({
                                success: false,
                                reason: 'Data di nascita non valida',
                            });
                        }
                    } else {
                        res.status(400).json({
                            success: false,
                            reason: 'Categoria non valida',
                        });
                    }
                }
            }
        } catch (e) {
            return logger.log({ level: 'error', message: e });
        }
    });
};