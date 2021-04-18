const express = require('express');
const ApiResponse = require('../src/utils/api-response');
const bodyParser = require("body-parser");

const openAddGmail = require('../server/cap/login');
const openYouTube = require('../server/cap/openYoutube');
const createV3Captcha = require('../server/cap/v3/v3-captcha');
const createV2Captcha = require('../server/cap/v2/v2-captcha');

module.exports = function createServer(app) {

    const server = express();

    server.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    server.use(bodyParser.urlencoded({
        extended: true
    }));
    server.use(bodyParser.json());

    server.get('/test', (req, res) => {
        res.send("Working");
    });

    server.post('/login', async (req, res) => {
        try {
            await openAddGmail(req, res)
        } catch (e) {
            res.send(ApiResponse.apiResponse("Some error has occured1", "Failed", []));
        }
    });

    server.post('/youtube', async (req, res) => {
        try {
            await openYouTube(req, res)
        } catch (e) {
            res.send(ApiResponse.apiResponse("Some error has occured " + e.message, "Failed", []));
        }
    });

    server.post('/v3', async (req, res) => {
        try {
            await createV3Captcha(req, res)
        } catch (e) {
            res.send(ApiResponse.apiResponse("Some error has occured1", "Failed", []));
        }
    });

    server.post('/v2', async (req, res) => {
        try {
            await createV2Captcha(req, res)
        } catch (e) {
            res.send(ApiResponse.apiResponse("Some error has occured1", "Failed", []));
        }
    });

    server.listen(9997, () => console.log("App started on port 9997"));
};