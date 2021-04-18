const electron = require('electron');
const {ipcMain, session} = require('electron')
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const fs = require('fs');
const Request = require('request');
var recordCaptchaID = "";
var domain = "";

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = async function createV2Captcha(req, res) {

    let cookies = req.body.cookies;
    let show = req.body.show;
    let proxy = req.body.proxy;
    let v2 = req.body.v2;
    domain = v2.domain;
    recordCaptchaID = req.body.recordCaptchaID;

    let data = {
        id: makeId(6),
        pageUrl:v2.v2.page_url,
        // pageUrl: 'https://www.google.com/recaptcha/api2/demo',
        // UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",        
        UA: v2.ua,
        // captchaKey: "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-",
        captchaKey: v2.v2.captcha_key,        
        // action: 'examples/v3scores',
        action: v2.v2.action,
        cookieContainer: cookies,
        proxy: proxy,
        // proxy: 'http://146.120.230.67:1490',
        type: 'v2',
        show: show,
    };

    let ses = session.fromPartition(data.id);
    if (data.proxy !== "") {
        ses.setProxy({proxyRules: data.proxy}, function () {
            console.log('using the proxy  ' + data.proxy);
        });
    }

    ses.protocol.interceptBufferProtocol("https", (request, callback) => {
        if (request.url === data.pageUrl) {
            let value = fs.readFileSync(__dirname + '/' + data.type + ".htm").toString();
            value = value.replace("{{SITEKEY}}", data.captchaKey).replace("{{SITEKEY}}", data.captchaKey);
            value = value.replace("{{ACTION}}", data.action);
            callback(new Buffer(value));
        }
        ses.protocol.uninterceptProtocol('https');
    });

    const captchaWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: data.show,
        webPreferences: {
            preload: path.join(__dirname, 'captcha-preload.js'),
            session: ses,
            additionalArguments: [data.captchaKey, data.action]
        }
    });
    captchaWindow.webContents.userAgent = data.UA;
    captchaWindow.webContents.siteKey = data.captchaKey;
    captchaWindow.webContents.siteAction = data.action;

    if (data.cookieContainer) {
        for (var cc in data.cookieContainer) {

            var coockoo = data.cookieContainer[cc];
            coockoo.url = coockoo.domain[0] === "." ? coockoo.domain.substr(1) : coockoo.domain;
            coockoo.url = "https://" + coockoo.url;

            ses.cookies.set(coockoo, (error => {
            }))
        }

    }

    captchaWindow.loadURL(data.pageUrl, {userAgent: data.UA});

    res.send({success: true})

};


ipcMain.on('main-console', (e, data) => {
    Request.post({
        "headers": {"content-type": "application/json"},
        "url": 'http://18.223.135.24:3001/api/record_captcha_tokens/update?where[id]=' + recordCaptchaID,
        "body": JSON.stringify({
            // "user_id": recordCaptchaID,
            "token": data,
            "isv2": true,
            "url": domain,
            is_recorded: true
        })
    }, (error, response, body) => {
        if (error) {
            // console.log(error)
            // console.log("Some error has occured")
        } else {
            // console.log(body)
        }
    });
})
