const {remote, ipcRenderer, ipcMain} = require('electron');

var passOns = window.process.argv.slice(-2);
window.onload = function () {
    console.log("idhar bhi");
    console.log(passOns);
};

window.mainConsole = function (data, closeIt) {
    ipcRenderer.send("main-console", data);
    if (closeIt) {
        window.close();
    }

}