const electron = require('electron');
const {ipcMain, session} = require('electron')
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
let currEmails = [];
let googleCookies = [];

module.exports = async function openAddGmail(req, res) {

    function makeId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    let randomData = makeId(6);
    let ses = session.fromPartition(randomData);

    const loginWindow = await new BrowserWindow({
        width: 500,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'launch-preload.js'),
            session: ses
        }
    });

    await loginWindow.loadURL('https://accounts.google.com/signin/v2/identifier?hl=en&passive=true&continue=https%3A%2F%2Fwww.google.com%2F', {userAgent: 'Chrome'});

    let response = new Promise((resolve, reject) => {

        loginWindow.webContents.on('did-finish-load', function (e) {
            if (loginWindow.webContents.getURL().indexOf("https://www.google.com") > -1) {

                ses.cookies.get({}, (error, cookies) => {

                    if (error) {
                        resolve({success: false, data: [], message: "Some error occured"})
                    } else {

                        let currEmail = "";
                        for (let x in currEmails) {
                            if (currEmails[x].id === loginWindow.id) {
                                currEmail = currEmails[x].email;
                                break;
                            }
                        }

                        let obj = {
                            email: currEmail,
                            cookies: cookies,
                            id: makeId(10)
                        };

                        let found = -1;
                        for (let x in googleCookies) {
                            if (googleCookies[x].email === obj.email) {
                                found = x;
                                break;
                            }
                        }

                        if (found === -1) {
                            googleCookies.push(obj);
                        } else {
                            googleCookies[found].cookies = obj.cookies;
                        }

                        let goCookies = JSON.stringify(googleCookies);
                        resolve({success: true, data: goCookies})
                        loginWindow.close();
                    }

                })
            } else {
                // resolve({success: false, data: [], message: "Some error occured"})
            }
        })
    })

    res.send(await response)

};

ipcMain.on('email-entered', (e, val) => {
    currEmails.push({
        email: val,
        id: e.sender.getOwnerBrowserWindow().id
    });
});