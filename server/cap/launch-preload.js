const {ipcRenderer} = require('electron');

window.onload = function () {
    document.getElementById('next').addEventListener('click', function (e) {
        let email = document.getElementById('Email').value;
        ipcRenderer.send('email-entered', email);
    });
}