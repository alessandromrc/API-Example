/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable new-cap */
/* eslint-disable block-spacing */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable eol-last */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
const helmet = require('helmet');
const contentSecurityPolicy = require('helmet-csp');
const logger = require('./utils/logger');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const db = require('./config/config').get(process.env.NODE_ENV);
const app = express();
const PORT = process.env.PORT || 80;

// Only in production!
/*
const https = require('https');
https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/fullchain.pem'),
    }, app)
    .listen(443);
*/

console.log('----------------------------------------------------------------------------');
logger.info('[Avvio] L\'API si sta avviando.');
app.use(helmet());
app.use(
    contentSecurityPolicy({
        rectives: {
            // eslint-disable-next-line quotes
            defaultSrc: ["'self'"],
            // eslint-disable-next-line quotes
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
    }),
);

app.set(require('./utils/counter')(app));
app.set('x-powered-by', false);
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser());
app.use(express.static(__dirname));
app.use(express.static('public'));


// * Endpoint Loader
const files = fs.readdirSync('./endpoints/');
for (let i = 0; i < files.length; i++) {
    require(`./endpoints/${files[i]}`)(app);
    logger.info(`[Moduli] ${i + 1} Modulo ${files[i].replace(/\.js$/, '')} caricato.`);
};


mongoose.Promise = global.Promise;
logger.info('[DB] Connessione al database.');
mongoose.connect(
    db.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
},
    logger.info('[DB] Connesso al database.'),
    function (e) {
        if (e != null) {
            logger.log({ level: 'error', message: e });
        }
    },
);

app.listen(PORT, () => {
    try {
        logger.log({ level: 'info', message: '[Avvio] L\'API è stata avviata.' });
    } catch (e) {
        logger.log({ level: 'error', message: e });
    }
});

process.on('uncaughtException', function (e) {
    logger.log({ level: 'error', message: e });
});

process.on('rejectionHandled', function (handle) {
    logger.log({ level: 'error', message: handle });
});