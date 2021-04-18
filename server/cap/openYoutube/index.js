const electron = require('electron');
const {ipcMain, session} = require('electron');
const BrowserWindow = electron.BrowserWindow;


module.exports = async function openYouTube(req, res) {

    function makeId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    let cookies = req.body.cookies;
    let proxy = req.body.proxy;
    let ses = session.fromPartition(makeId(6));

    if (proxy !== "") {
        ses.setProxy({proxyRules: proxy}, function () {
            console.log('using the proxy  ' + proxy);
        });
    }

    const captchaWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: true,
        webPreferences: {
            session: ses,
        }
    });

    if (cookies.length > 0) {
        for (let cc in cookies) {
            let coockoo = cookies[cc];
            coockoo.url = coockoo.domain[0] === "." ? coockoo.domain.substr(1) : coockoo.domain;
            coockoo.url = "https://" + coockoo.url;
            ses.cookies.set(coockoo, (error => {
            }))
        }
    }

    captchaWindow.loadURL('https://youtube.com', {userAgent: 'Chrome'});


}