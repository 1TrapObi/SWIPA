const { remote, ipcRenderer } = require('electron');
const { BrowserWindow, session, ipcMain } = remote
const path = require('path');
const fs = require("fs");

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var googleCookies = localStorage.getItem("gCookies") || "[]";
googleCookies = JSON.parse(googleCookies);
document.getElementById('account-count').innerHTML = googleCookies.length;

var currEmails = [];
document.getElementById('launch-login').addEventListener('click', function(e) {

    var ses = session.fromPartition(makeId(6));
    const loginWindow = new BrowserWindow({
        width: 500,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'launch-preload.js'),
            session: ses
        }
    });
    loginWindow.loadURL('https://accounts.google.com/signin/v2/identifier?hl=en&passive=true&continue=https%3A%2F%2Fwww.google.com%2F', { userAgent: 'Chrome' });
    loginWindow.webContents.on('did-finish-load', function(e) {
        if (loginWindow.webContents.getURL().indexOf("https://www.google.com") > -1) {

            ses.cookies.get({})
                .then((cookies) => {
                    //    ipcRenderer.send('gCookies', cookies);

                    var currEmail = "";
                    for (var x in currEmails) {
                        if (currEmails[x].id == loginWindow.id) {
                            currEmail = currEmails[x].email;
                            break;
                        }
                    }


                    var obj = {
                        email: currEmail,
                        cookies: cookies
                    }
                    var found = -1;
                    for (var x in googleCookies) {
                        if (googleCookies[x].email == obj.email) {
                            found = x;
                            break;
                        }
                    }
                    if (found == -1) {
                        googleCookies.push(obj);
                    } else {
                        googleCookies[found].cookies = obj.cookies;
                    }



                    var goCookies = JSON.stringify(googleCookies);
                    localStorage.setItem('gCookies', goCookies);
                    document.getElementById('account-count').innerHTML = googleCookies.length;

                    loginWindow.close();
                    //cookieArray.push(cookies);


                    //console.log(cookieArray);
                }).catch((error) => {
                    console.log(error)
                })
        }
    })
});

// var data = {
//     id: makeId(6),
//     pageUrl: 'https://recaptcha-demo.appspot.com/recaptcha-v3-request-scores.php',
//     UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
//     captchaKey: "6LdyC2cUAAAAACGuDKpXeDorzUDWXmdqeg-xy696",
//     action: 'examples/v3scores',
//     cookieContainer: googleCookies[Math.floor(Math.random() * googleCookies.length)],
//     proxy: 'http://127.0.0.1:8888',
//     type: 'v3',
//     show: false
// }

// var data = {
//     id: makeId(6),
//     pageUrl: 'https://www.google.com/recaptcha/api2/demo',
//     UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
//     captchaKey: "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-",
//     action: 'examples/v3scores',
//     cookieContainer: googleCookies[Math.floor(Math.random() * googleCookies.length)].cookies,
//     proxy: 'http://127.0.0.1:8888',
//     type: 'v2',
//     show: true,
// }



document.getElementById('get-v3-token').addEventListener('click', function(e) {
    var data = {
        id: makeId(6),
        pageUrl: 'https://recaptcha-demo.appspot.com/recaptcha-v3-request-scores.php',
        UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        captchaKey: "6LdyC2cUAAAAACGuDKpXeDorzUDWXmdqeg-xy696",
        action: 'examples/v3scores',
        cookieContainer: null, //googleCookies[Math.floor(Math.random() * googleCookies.length)].cookies,
        //proxy: 'http://146.120.230.67:1490',
        type: 'v3',
        show: true
    }

    ipcRenderer.send("get-token", data)
});




ipcMain.on('email-entered', (e, val) => {
    currEmails.push({
        email: val,
        id: e.sender.getOwnerBrowserWindow().id
    });
});

document.getElementById('get-v2-token').addEventListener('click', function(e) {
    var data = {
        id: makeId(6),
        pageUrl: 'https://www.google.com/recaptcha/api2/demo',
        UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        captchaKey: "6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-",
        action: 'examples/v3scores',
        cookieContainer: googleCookies[Math.floor(Math.random() * googleCookies.length)].cookies,
        //proxy: 'http://146.120.230.67:1490',
        type: 'v2',
        show: true,
    }

    ipcRenderer.send("get-token", data)
});