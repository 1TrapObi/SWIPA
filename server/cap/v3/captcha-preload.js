const {remote, ipcRenderer, ipcMain} = require('electron');

var passOns = window.process.argv.slice(-2);
window.onload = function () {
   
}

window.mainConsole = function (data, closeIt) {
    ipcRenderer.send("main-console1", data);
    if (closeIt) {
        window.close();
    }

}