const fs = require('fs');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
let mainWindow;
var jsonfile = require('jsonfile');
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
module.exports = async function openYoutube(req, res) {

    fs.writeFile(userDataPath + '/abc.json', "", function (err) {
        if (err) throw err;
        else
            console.log("Abc file created success")
    });

    async function readProxyFromFile(cb) {
        fs.readFile(userDataPath + '/currentproxy.txt', function (err, data) {
            if (err) {
                console.log("no file " + err.message);
                cb([]);
            } else
                cb(data);
        });
    }

    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 360,
            height: 550,
            center: true,
            title: 'Captcha Solver',
            webPreferences: {
                allowRunningInsecureContent: true,
                webSecurity: false
            }
        });


        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));
        mainWindow.show();


        mainWindow.setMenu(null);
        // Open the DevTools.
        // mainWindow.webContents.openDevTools()

        mainWindow.on('closed', function () {
            mainWindow = null
        });
    }

    fs.readFile(userDataPath + '/ .txt', 'utf8', function (err, data) {
        if (err)
            console.log("error" + err.message);
        else {
            let proxyArray = data.split(':');
            if (proxyArray.length == 4) {
                let username = proxyArray[2];
                let password = proxyArray[3];
                app.on('login', (event, webContents, request, authInfo, callback) => {
                    callback(username, password)
                });
            }
        }
    });


    createWindow();

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });

    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow()
        }
    });


};