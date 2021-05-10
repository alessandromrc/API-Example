/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable space-before-function-paren */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable eol-last */
// const logger = require('../utils/logger');
const { createReadStream } = require('fs');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const random = require('./../utils/randomgenerator');
const { ApiKey } = require('./../config/config.json');

module.exports = function (app) {
    app.use(fileUpload({
        createParentPath: true,
    }));
    app.post('/api/upload-image', async (req, res) => {
        try {
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded',
                });
            } else if (req.files.image.mimetype.includes('image')) {
                // * TODO creare un controllo che il nome random che viene generato non sia già un file esistente!
                const imagename = random(10);
                const image = req.files.image;
                const filename = './resources/images/' + imagename + '.' + req.files.image.mimetype.substring(6);
                image.mv(filename);
                fetch('https://api.cloudmersive.com/image/nsfw/classify', {
                    method: 'post',
                    body: createReadStream(filename),
                    headers: {
                        'Content-Type': 'multipart/form-data/json',
                        'Apikey': ApiKey,
                    },
                })
                    .then((res) => res.json())
                    .then((json) => {
                        if (json.ClassificationOutcome == 'UnsafeContent_HighProbability') {
                            fs.unlinkSync(filename);
                            res.send({
                                status: false,
                                message: 'The file is surely containing NSFW content!',
                            });
                            // console.log('UnsafeContent_HighProbability');
                        } else if (json.ClassificationOutcome == 'RacyContent') {
                            fs.unlinkSync(filename);
                            res.send({
                                status: false,
                                message: 'The file is probably containing NSFW content!',
                            });
                            // console.log('RacyContent');
                        } else if (json.ClassificationOutcome == 'SafeContent_ModerateProbability') {
                            fs.unlinkSync(filename);
                            res.send({
                                status: false,
                                message: 'The file is probably contain NSFW content!',
                            });
                            // console.log('SafeContent_ModerateProbability');
                        } else {
                            res.send({
                                status: true,
                                message: 'File uploaded successfully!',
                            });
                            // console.log('SafeContent_HighProbability');
                        }
                    });
            } else {
                res.send({
                    status: false,
                    message: 'The file you sent isn\'t a picture',
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });
};