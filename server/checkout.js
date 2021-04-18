const request = require('request');
const http = require('http');
const fs = require('fs');
const JSSoup = require('jssoup').default;
const exec = require('child_process').execFile;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
let taskCsvFilePath = '';
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csvtojson');
const ApiResponse = require('../src/utils/api-response');
const Headers = require('./headers');
const FormData = require('./form-data');
const webhook = require("webhook-discord");

module.exports = async function Checkout(req, res) {
    // global variable
    var LOGS = [];
    let data = req.body;
    var cc = '';
    let systemPath = req.body[1].system_path;
    taskCsvFilePath = systemPath + "/task.csv";
    await
        makeApiCalls(data);

    async function makeApiCalls(data, systemPath) {
        for (let index = 0; index < data.length; index++) {
            let billingData = data[index]['billingData'][0];
            let settingsData = data[index]['settingsData'][0];
            let taskData = data[index]['taskData'];
            try {
                await CheckOut(taskData, billingData, settingsData, systemPath);
            } catch (e) {
                await changeTaskStatus(taskData['id'], "Error occured");
            }
        }
    }

    async function webhookResponse(url, message, response) {
        // const Hook = new webhook.Webhook("https://discordapp.com/api/webhooks/572401804969508867/p_16aHm2HasH-p614l4e7-RpCPVUe6Rc15W5mZ7iAOvVbbhirTGv_1ZrZuft5SAsp9Je");
        const Hook = new webhook.Webhook(url);
        const msg = new webhook.MessageBuilder()
            .setName("Shopify Bot")
            .setColor("#B44")
            .setText("Response for the task")
            .addField("Message", message)
            .addField("Response", response)
            .setTime();
        await Hook.send(msg);
    }

    async function CheckOut(taskData, billingData, settingsData, systemPath) {
        let TaskId = taskData['id'];
        let Website_DOMAIN = taskData[0];
        let product_size = taskData[1];
        let status = taskData[4];
        let product_url = taskData[5];

        console.log("ProductUrl - " + product_url);
        Logs("ProductUrl - " + product_url);

        //let IsCaptcha = taskData[7] === "Yes" ? true : false;
        let IsCaptcha = taskData[12];
        console.log("IsCaptcha - " + IsCaptcha);
        Logs("IsCaptcha - " + IsCaptcha);
        let Search_Keyword = taskData[2];

        let first_name = billingData[0];
        let last_name = billingData[1];
        let email = billingData[2];
        let phone = billingData[3];
        let add1 = billingData[4];
        let city = billingData[6];
        let province = billingData[7];
        let country = billingData[8];
        let zip = billingData[9];

        let expp = billingData[11];
        let expp2 = expp.split('/');
        let expmonth = expp2[0];
        let expyear = expp2[1];
        let cardnumber = billingData[10];
        let cardname = 'Steve Vue';
        let cardcvv = billingData[12];

        let c_url = settingsData['captcha_url'];
        let default_proxy = settingsData['default_proxy'];
        let default_profile = settingsData['default_profile'];
        let default_size = settingsData['default_size'];
        let retry_delay = settingsData['retry_delay'];

        //let key = settingsData[0];
        //let k = settingsData[1];

        let webHookUrl = settingsData['webhook_url'];
        let requestWebhookResponse = settingsData['webhook_response']; //true or false will come in string

        if (requestWebhookResponse == 'true') {
            await webhookResponse(webHookUrl, "Running Start", "Success");
        }

        let json_product_url = product_url + '.json';
        var captchaType = '';
        fs.readFile(systemPath + '/Captcha.txt', function (err, data) {
            if (err)
                console.log(err.message);
            else
                captchaType = data;
        });

        await changeTaskStatus(TaskId, "Running Start");
        console.log("Running Start");
        Logs("Running Start");

        if (Search_Keyword === "") {
            Search_Keyword = 'na';
        }
        Search_Keyword = 'na';
        Logs("SearchKeyword - " + Search_Keyword)
        if (Search_Keyword !== "na") {
            product_url = await Search(TaskId, Search_Keyword, Website_DOMAIN);
            json_product_url = product_url + '.json';
            Logs("Product Url Found - " + json_product_url)
        }

        let headers = await Headers.searchHeader();
        request.get({
            url: json_product_url,
            gzip: true,
            headers: headers
        }, async function (error, response, body) {
            var size_array = JSON.parse(body);
            var size_array2 = size_array['product']['variants'];
            var size = '';
            let vid = "";
            if (product_size) {
                var array_length = size_array2.length;
                for (i = 0; i < array_length; i++) {
                    let sz = size_array2[i];
                    if (Website_DOMAIN === "https://yeezysupply.com") {
                        size = sz['public_title'];
                    } else {
                        size = sz['title'];
                    }
                    if (size === product_size) {
                        vid = sz['id'];
                        vid = vid.toString();
                        vid = vid.replace('L', '')
                    }
                }
            } else {
                vid = size_array2[0]['id'];
                vid = vid.toString();
                vid = vid.replace('L', '')
            }
            Logs("VariantId - " + vid)
            cc = response.headers['set-cookie'];

            let cartHeaders = await Headers.cartHeader(product_url, Website_DOMAIN, cc);
            request.post({
                url: Website_DOMAIN + '/cart/add.js',
                gzip: true,
                headers: cartHeaders,
                form: {'id': vid, 'quantity': '1'}
            }, async function (error, response, body) {
                cc = response.headers['set-cookie'];
                let cartHeaders2 = await Headers.cartHeader2(product_url, Website_DOMAIN, cc);
                request.post({
                    url: Website_DOMAIN + '/cart',
                    gzip: true,
                    followAllRedirects: true,
                    headers: cartHeaders2,
                    form: {'updates[]': '1', 'checkout': 'CHECKOUT'}
                }, async function (error, response, body) {
                    var souper = new JSSoup(body);
                    cc = response.headers['set-cookie'];
                    var authencity_token = souper.find('input', attrs = {'name': 'authenticity_token'});
                    var at = authencity_token.attrs.value;
                    var checkout_url = souper.find('form', attrs = {'class': 'edit_checkout'})
                    checkout_url = checkout_url.attrs.action;
                    checkout_url = Website_DOMAIN + checkout_url;
                    await changeTaskStatus(TaskId, "Cart Added");
                    Logs("Cart Added")

                    let checkoutHeaders = await Headers.checkoutHeaders(checkout_url, cc);

                    var cap_token = '';
                    if (IsCaptcha) {
                        await changeTaskStatus(TaskId, "SolvingCaptcha");
                        Logs("Captcha Start");
                        console.log("Captcha Start");
                        if (captchaType === "twoCaptcha") {
                            cap_token = await Twocaptcha(checkout_url, key, k);
                        } else {
                            cap_token = await ElectronCaptcha(checkout_url);
                            cap_token = cap_token.toString();
                            cap_token = cap_token.replace('"', '').replace('\n', '');
                            cap_token = cap_token.replace('"', '');
                        }
                    }
                    request.post({
                        url: checkout_url,
                        gzip: true,
                        followAllRedirects: true,
                        headers: checkoutHeaders,
                        form: await FormData.checkoutFormData(at, email, first_name, add1, city, country, province, zip, phone, last_name, cap_token)

                    }, async function (error, response, body) {
                        var souper = new JSSoup(body);
                        let ss5 = souper.text;
                        if (ss5.includes('Captcha validation failed. Please try again')) {
                            await changeTaskStatus(TaskId, "CaptchaError");
                            Logs("Captcha Error")
                        } else {
                            if (ss5.includes('Enter a new shipping address and try again')) {
                                await changeTaskStatus(TaskId, "ShippingNotAvailable");
                                Logs("Shipping Not Available")

                            } else {
                                cc = response.headers['set-cookie'];
                                var authencity_token = souper.find('input', attrs = {'name': 'authenticity_token'});
                                var at = authencity_token.attrs.value;
                                var shipping_method = souper.find('div', attrs = {'class': 'radio-wrapper'});
                                var shipping_rate = shipping_method.attrs['data-shipping-method'];
                                await changeTaskStatus(TaskId, "ProfileAdded");
                                Logs("Profile Added");
                                let refurl = checkout_url + "?previous_step=contact_information&step=shipping_method"
                                let checkoutHeaders2 = await Headers.checkoutHeaders2(cc, refurl, Website_DOMAIN);

                                request.post({
                                    url: checkout_url,
                                    gzip: true,
                                    followAllRedirects: true,
                                    headers: checkoutHeaders2,
                                    form: await FormData.checkoutFormData2(at, shipping_rate)
                                }, async function (error, response, body) {
                                    cc = response.headers['set-cookie'];
                                    var souper = new JSSoup(body);
                                    var authencity_token = souper.find('input', attrs = {'name': 'authenticity_token'});
                                    var at = authencity_token.attrs.value;
                                    var pid = '12807719';
                                    var total_price = souper.find('span', attrs = {'class': 'total-recap__final-price'});
                                    var tprice = total_price.attrs['data-checkout-payment-due-target'];
                                    start = 'Shopify.Checkout.token = "';
                                    end = '";';
                                    identifier = (souper.text.split(start))[1];
                                    identifier = identifier.split(end)[0];
                                    await changeTaskStatus(TaskId, "ShippingAdded");
                                    Logs("Shipping Added");
                                    location = checkout_url + "?previous_step=shipping_method&step=payment_method";
                                    dir = "ltr";
                                    fonts = "Lato";
                                    let refurl2 = "https://checkout.shopifycs.com/number?identifier=" + identifier + "&location=" + location + "&dir=ltr&fonts[]=Lato"
                                    let paymentHeaders = await Headers.paymentHeaders(refurl2);
                                    request.post({
                                        url: 'https://elb.deposit.shopifycs.com/sessions',
                                        gzip: true,
                                        followAllRedirects: true,
                                        headers: paymentHeaders,
                                        form: await FormData.paymentFormData(expmonth, cardname, cardnumber, cardcvv, expyear)
                                    }, async function (error, response, body) {
                                        var souper = new JSSoup(body);
                                        start = '{"id":"';
                                        end = '"}';
                                        sid = (souper.text.split(start))[1];
                                        sid = sid.split(end)[0];
                                        let refurl3 = checkout_url + "?previous_step=shipping_method&step=payment_method"
                                        let paymentHeaders2 = await Headers.paymentHeaders2(refurl3, cc);
                                        request.post({
                                            url: checkout_url,
                                            gzip: true,
                                            followAllRedirects: true,
                                            headers: paymentHeaders2,
                                            form: await FormData.paymentFormData2(at, sid, pid, phone, tprice)
                                        }, async function (error, response, body) {
                                            let souper = new JSSoup(body);
                                            let ss8 = souper.text;
                                            if ((ss8.includes("Security code was not matched by the processor")) || (ss8.includes("Security code was not matched by the processor"))) {
                                                await changeTaskStatus(TaskId, "Card Invalid");
                                                Logs("Card Invalid")
                                            } else {
                                                await changeTaskStatus(TaskId, "Card Invalid");
                                                Logs("Card Invalid")
                                            }
                                        });
                                    });
                                });
                            }
                        }

                    });
                });
            });
        });
    }

    async function Logs(log_text) {
        var datetime = new Date();
        //console.log(datetime);
        LOGS.push(datetime + " - " + log_text);
        let txt = LOGS.join('\r\n');
        await fs.writeFile(systemPath + '/Logs.txt', txt, function () {
        });
    }

    async function WriteFile(curl) {
        return new Promise(async function (resolve, reject) {

            await fs.writeFile('cap-win32-x64/resources/app/url.json', curl, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve("FileWritten");
                }
            });
        })
    }

    async function ReadFile() {
        return new Promise(async function (resolve, reject) {
            await fs.readFile('cap-win32-x64/resources/app/abc.json', function (err, data) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        })
    }

    async function ElectronCaptcha(checkOutUrl) {
        //let captchaToken = "";
        console.log("Captcha url " + checkOutUrl);
        let cct = checkOutUrl;
        await WriteFile(cct);

        //await exec('cap-win32-x64\\cap.exe', function (err, data) {
        //    if (err) {
        //        console.log("Error occured" + err.message);
        //    } else {
        //        console.log("Data : " + data);
        //    }
        //});

        //await WriteCaptchaUrlFile(cct);
        headersCaptcha = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'body': 'JSON.stringify({})'
        };

        request.post({
            url: "http://localhost:9997/open-captcha-harvester",
            headers: headersCaptcha,
            body: JSON.stringify({main: false})
        }, async function (error, response, body) {
        });

        await Sleep(10);


        captchaToken = await ReadFile();
        console.log("waiting for capToken start")
        await Sleep(45);
        console.log("waiting for capToken End")
        //let captchaToken = await ReadCaptchaTokenFile();
        captchaToken = await ReadFile();
        console.log("CaptchaTokenOuter - " + captchaToken)

        while (captchaToken.toString() === "undefined" || captchaToken.toString() == null || captchaToken.toString() == "null") {
            captchaToken = await ReadCaptchaTokenFile();
            console.log("CaptchaTokenInner - " + captchaToken)
            if (captchaToken.toString() !== "undefined" || captchaToken.toString() == null || captchaToken.toString() == "null")
                break;
        }


        console.log("CaptchaTokenExit - " + captchaToken)
        return captchaToken;
    }

    async function Twocaptcha(pageurl, key, k) {
        let First_Url = "http://2captcha.com/in.php?key=" + key + "&method=userrecaptcha&pageurl=" + pageurl + "&googlekey=" + k;
        let captchaid = '';
        let responsee = '';

        return new Promise(function (resolve, reject) {
            request.get({
                url: First_Url,
                gzip: true
            }, async function (error, response, body) {
                captchaid = body.replace('OK|', '');
                await Sleep(10);
                var Second_Url = "http://2captcha.com/res.php?key=" + key + "&action=get&id=" + captchaid;

                request.get({
                    url: Second_Url,
                    gzip: true
                }, async function (error, response, body) {
                    responsee = body.replace('OK|', '');
                    if (responsee === "CAPCHA_NOT_READY") {
                        await Sleep(15);
                        request.get({
                            url: Second_Url,
                            gzip: true
                        }, async function (error, response, body) {
                            responsee = body.replace('OK|', '');
                            if (responsee === "CAPCHA_NOT_READY") {
                                await Sleep(15);
                                request.get({
                                    url: Second_Url,
                                    gzip: true
                                }, function (error, response, body) {
                                    responsee = body.replace('OK|', '');
                                    if (responsee === "CAPCHA_NOT_READY") {
                                        resolve("CaptchaNotSolvable");
                                    } else {
                                        resolve(responsee);
                                    }
                                });
                            } else {
                                resolve(responsee);
                            }
                        });
                    } else {
                        resolve(responsee);
                    }
                });
            });
        })
    }

    async function changeTaskStatus(taskId, status) {

        let taskDataResponse = await fetchTaskDataFromCsv();
        let isElementFound = false;
        let newTaskData = taskDataResponse;
        let deletedData = {};

        for (let index = 0; index < newTaskData.length; index++) {
            if (parseInt(newTaskData[index]['id']) === parseInt(taskId)) {
                isElementFound = true;
                deletedData = newTaskData[index];
                newTaskData.splice(index, 1);
            }
        }

        if (!isElementFound)
            return;

        deletedData[4] = status;
        newTaskData.push(deletedData);

        const csvWriter = createCsvWriter({
            path: taskCsvFilePath,
            header: [
                {id: 'site', title: '0'},
                {id: 'size', title: '1'},
                {id: 'keywords', title: '2'},
                {id: 'billingProfile', title: '3'},
                {id: 'status', title: '4'},
                {id: 'link', title: '5'},
                {id: 'proxy', title: '6'},
                {id: 'mode', title: '7'},
                {id: 'amount', title: '8'},
                {id: 'id', title: 'id'}
            ]
        });

        for (let index = 0; index < newTaskData.length; index++) {
            newTaskData[index].site = newTaskData[index][0];
            newTaskData[index].size = newTaskData[index][1];
            newTaskData[index].keywords = newTaskData[index][2];
            newTaskData[index].billingProfile = newTaskData[index][3];
            newTaskData[index].status = newTaskData[index][4];
            newTaskData[index].link = newTaskData[index][5];
            newTaskData[index].proxy = newTaskData[index][6];
            newTaskData[index].mode = newTaskData[index][7];
            newTaskData[index].amount = newTaskData[index][8];
            delete newTaskData[index][0];
            delete newTaskData[index][1];
            delete newTaskData[index][2];
            delete newTaskData[index][3];
            delete newTaskData[index][4];
            delete newTaskData[index][5];
            delete newTaskData[index][6];
            delete newTaskData[index][7];
            delete newTaskData[index][8];
        }

        csvWriter.writeRecords((newTaskData))       // returns a promise
            .then(() => {
                console.log('Editing done..');
            }).catch((e) => {
            console.log("Some error occured while writing data in CSV" + e.message);
        });
    }

    async function Search(TaskId, Search_Keyword, Website_DOMAIN) {
        var Search_KS = Search_Keyword.replace(' ', '+');
        await changeTaskStatus(TaskId, "Searching");
        let headers = await Headers.searchHeader(Website_DOMAIN);
        let time = (new Date()).getTime() / 1000;
        let ts = parseInt(time);
        ts = ts.toString();
        let random_number = Math.floor(Math.random() * 999 + 101);
        random_number = random_number.toString();
        ts = ts + random_number;
        var search_url = 'https://www.searchanise.com/getresults?api_key=3J2M9Q3r7i&q=' + Search_KS + '&sortBy=relevance&sortOrder=desc&startIndex=0&maxResults=45&items=true&pages=true&categories=true&suggestions=true&queryCorrection=true&suggestionsMaxResults=3&pageStartIndex=0&pagesMaxResults=20&categoryStartIndex=0&categoriesMaxResults=20&facets=true&facetsShowUnavailableOptions=true&ResultsTitleStrings=2&ResultsDescriptionStrings=0&output=jsonp&callback=jQuery111009158794206753316_' + ts + '&_=' + ts;
        let product_url = "";
        return new Promise(function (resolve, reject) {
            request.get({
                url: search_url,
                gzip: true,
                headers: headers
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    let search_text1 = body;
                    let start = 'jQuery111009158794206753316_' + ts + '(';
                    let end = ');';
                    search_text1 = (search_text1.split(start))[1];
                    search_text1 = search_text1.split(end)[0];
                    let Json_Search = JSON.parse(search_text1);
                    let JsonSearch_Items = Json_Search['items'];
                    let Length_Items = JsonSearch_Items.length;
                    if (Length_Items > 1) {
                        product_url = Json_Search['items'][0]['link']
                    }
                    resolve(product_url);
                }
            });
        })

    }

    async function fetchTaskDataFromCsv() {
        let taskData = [];
        await csv()
            .fromFile(taskCsvFilePath)
            .then((jsonObj) => {
                taskData = jsonObj;
            });
        return taskData;
    }

    async function Sleep(seconds) {
        let waitTill = new Date(new Date().getTime() + seconds * 1000);
        while (waitTill > new Date()) {
        }
    }

};



