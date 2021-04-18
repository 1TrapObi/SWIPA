const electron = require('electron');
var jsonfile = require('jsonfile');
var path = require('path');
const userDataPath = (electron.app || electron.remote.app).getPath('userData');

var bookmarks = userDataPath + '/abc.json';
jsonfile.writeFile(bookmarks, null, function (err) {
});

var API = function () {
    this.jsonfile = require('jsonfile');
    this.path = require('path');
    this.bookmarks = userDataPath + '/abc.json';
};

window.api = new API();

window.onload = function () {
    if (document.URL.indexOf("google") === -1) {
        var script = document.createElement("script");
        script.src = "http://code.jquery.com/jquery-2.1.4.min.js";
        script.onload = script.onreadystatechange = function () {
            $(document).ready(function () {
                var temp = '<script src = "https://www.google.com/recaptcha/api.js"></script><form action="" method="post" id="captcha"><div class="g-recaptcha" data-sitekey="6LeoeSkTAAAAAA9rkZs5oS82l69OEYjKRZAiKdaF"></div><br><br><br><br><!--<button id="addtoresponse" style="display:none;">Add Response</button>--><br><br><br><!--<textarea rows="25" cols="150" id="response" style="display:none;"></textarea>--></form><!--js--><script>setInterval(function () {var gh = $(".g-recaptcha-response").val();if (gh != "" && gh != undefined) {$(".g-recaptcha-response").val(""); window.api.jsonfile.writeFile(window.api.bookmarks, gh, function (err) { })}}, 100);</script>';
                $('body').html(temp);
                document.getElementById('views').style.display = 'none';
            });
        };
        document.body.appendChild(script);
    }
};