const { app, BrowserWindow, session, ipcMain, protocol } = require('electron')
const path = require('path');
const fs = require('fs');

var googleCookies = [];

function createCaptcha(data) {
    var ses = session.fromPartition(data.id);
    if (data.proxy) {
        ses.setProxy({ proxyRules: data.proxy }, function() {
            console.log('using the proxy  ' + data.proxy);
        });
    }

    ses.protocol.interceptBufferProtocol("https", (request, callback) => {
        if (request.url === data.pageUrl) {
            var value = fs.readFileSync(data.type + ".htm").toString();
            value = value.replace("{{SITEKEY}}", data.captchaKey).replace("{{SITEKEY}}", data.captchaKey);
            value = value.replace("{{ACTION}}", data.action);
            var content = new Buffer(value);
            callback(content);
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
    })
    captchaWindow.webContents.userAgent = data.UA
    captchaWindow.webContents.siteKey = data.captchaKey;
    captchaWindow.webContents.siteAction = data.action;

    if (data.cookieContainer) {
        for (var cc in data.cookieContainer) {

            var coockoo = data.cookieContainer[cc];
            coockoo.url = coockoo.domain[0] === "." ? coockoo.domain.substr(1) : coockoo.domain;
            coockoo.url = "https://" + coockoo.url;

            ses.cookies.set(coockoo)
                .then(() => {
                    // success
                }, (error) => {
                    //  console.error(error)
                })
        }

    }

    captchaWindow.loadURL(data.pageUrl, { userAgent: data.UA });
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    mainWindow.webContents.executeJavaScript('localStorage.getItem("gCookies");', true)
        .then((result) => {
            googleCookies = JSON.parse(result) || [];

        })


    //

    // ipcMain.on('gCookies', (e, cookies) => {
    //     googleCookies.push(cookies);
    //     var goCookies = JSON.stringify(googleCookies);
    //     mainWindow.webContents.executeJavaScript("localStorage.setItem('gCookies', '" + goCookies + "')");
    // });



    mainWindow.loadFile('index.html');
    // mainWindow.loadURL('https://example.com')

}



app.whenReady().then(() => {




    createWindow()
        // createCaptcha({
        //     id: "aa",
        //     pageUrl: 'https://google.com',
        //     UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        //     captchaKey: "6LdyC2cUAAAAACGuDKpXeDorzUDWXmdqeg-xy696",
        //     action: 'examples/v3scores',
        //     cookieContainer: []
        // })
    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

    ipcMain.on('get-token', (e, data) => {
        createCaptcha(data);
    });

    ipcMain.on('main-console', (e, data) => {
        console.log("AAAYA")
        console.log(data);
    })
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})