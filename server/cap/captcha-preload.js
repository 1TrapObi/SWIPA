const { remote, ipcRenderer, ipcMain } = require('electron');

var passOns = window.process.argv.slice(-2);
window.onload = function() {
    console.log("idhar bhi")
    console.log(passOns);

}

// let oldXHROpen = window.XMLHttpRequest.prototype.open;
// window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
//     this.addEventListener('load', function() {
//         console.log('data: ' + this.responseText);
//     });

//     return oldXHROpen.apply(this, arguments);
// }

window.mainConsole = function(data, closeIt) {
    ipcRenderer.send("main-console", data);
    if (closeIt) {
        window.close();
    }

}