/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable eol-last */
/* eslint-disable indent */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config').get(process.env.NODE_ENV);
const salt = 14;
const logger = require('../utils/logger');

// eslint-disable-next-line new-cap
const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 100,
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    password2: {
        type: String,
        required: true,
        minlength: 8,
    },
    token: {
        type: String,
    },
    categoria: {
        type: String,
        required: true,
    },
    data_di_nascita: {
        type: String,
        required: true,
    },
    regione: {
        type: String,
        required: true,
    },
});

// * Cripta la password prima di salvarla nel database
userSchema.pre('save', function (next) {
    try {
        const user = this;
        if (user.isModified('password')) {
            bcrypt.genSalt(salt, function (err, salt) {
                if (err) {
                    logger.log({ level: 'error', message: err });
                    return next(err);
                }
                bcrypt.hash(user.password, salt, function (err, hash) {
                    if (err) {
                        logger.log({ level: 'error', message: err });
                        return next(err);
                    }
                    user.password = hash;
                    user.password2 = hash;
                    next();
                });
            });
        } else {
            next();
        }
    } catch (e) {
        return logger.log({ level: 'error', message: e });
    }
});
// * Compara la password a quella nel database
userSchema.methods.comparepassword = function (password, cb) {
    try {
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if (err) {
                logger.log({ level: 'error', message: err });
                return cb(next);
            }
            cb(null, isMatch);
        });
    } catch (e) {
        return logger.log({ level: 'error', message: e });
    }
};
// * Genera il token nel database
userSchema.methods.generateToken = function (cb) {
    try {
        const user = this;
        const token = jwt.sign(user._id.toHexString(), config.SECRET);

        user.token = token;
        user.save(function (err, user) {
            if (err) {
                logger.log({ level: 'error', message: err });
                return cb(err);
            }
            cb(null, user);
        });
    } catch (e) {
        return logger.log({ level: 'error', message: e });
    }
};
// * Cerca con il token nel database
userSchema.statics.findByToken = function (token, cb) {
    try {
        const user = this;
        jwt.verify(token, config.SECRET, function (err, decode) {
            user.findOne({
                _id: decode,
                token: token,
            }, function (err, user) {
                if (err) {
                    logger.log({ level: 'error', message: err });
                    return cb(err);
                }
                cb(null, user);
            });
            if (err) {
                logger.log({ level: 'error', message: err });
            }
        });
    } catch (e) {
        return logger.log({ level: 'error', message: e });
    }
};
// * Cancella il token
userSchema.methods.deleteToken = function (token, cb) {
    try {
        const user = this;
        user.updateOne({
            $unset: {
                token: 1,
            },
        }, function (err, user) {
            if (err) {
                logger.log({ level: 'error', message: err });
                return cb(err);
            }
            cb(null, user);
        });
    } catch (e) {
        return logger.log({ level: 'error', message: e });
    }
};

module.exports = mongoose.model('User', userSchema);