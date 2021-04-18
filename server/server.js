var request = require('request');
var http = require('http');
var fs = require('fs');
// var exec = require('child_process').exec;
var exec = require('child_process').execFile;
//const electron = require('electron')
//const app = electron.app
//const BrowserWindow = electron.BrowserWindow
//let mainWindow;

//const { app, BrowserWindow } = require('electron');

var JSSoup = require('jssoup').default;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
global.cc = '';
global.vid = '';
var Website_DOMAIN = 'https://kith.com';
var product_url = 'https://kith.com/collections/new-arrivals/products/vsdsu7404-dvg4g-d41o';
var json_product_url = 'https://kith.com/collections/new-arrivals/products/vsdsu7404-dvg4g-d41o.json';
var product_size = 'S';
var email = 'coderbadass@gmail.com';
var first_name = 'Amit';
var last_name = 'M';
var add1 = '117/395 O Block';
var city = 'FRESNO';
var province = 'CA';
var country = 'United States';
var zip = '93017';
var phone = '9795771110';
//credit_card = { 'credit_card': { 'month': expmonth, 'name': cardname, 'number': cardnumber, 'verification_value': cardcvv, 'year': expyear } }
var expmonth = '10';
var expyear = '2022';
var cardnumber = '4859109358964081';
var cardname = 'Steve Vue';
var cardcvv = '998';
var Search_Keyword = 'KITH SOLID MILITIA JACKET';
//var Search_Keyword = 'na';
var search_text = '';
var responsee = "CAPCHA_NOT_READY";
const jsonfile = require('jsonfile')
var LOGS = [];

function Logs(log_text) {
    LOGS.push(log_text);
    var txt = LOGS.join('\r\n');
    //console.log(LOGS);
    fs.writeFile('Logs.txt', txt, function () {
    });
}


function Twocaptcha(pageurl) {

    var key = "2fd2b12c5f8023dcc636fbb52c1737f7";
    var k = "6LeoeSkTAAAAAA9rkZs5oS82l69OEYjKRZAiKdaF";
    var page_url = pageurl;
    var First_Url = "http://2captcha.com/in.php?key=" + key + "&method=userrecaptcha&pageurl=" + page_url + "&googlekey=" + k;
    var captchaid = '';
    var responsee = '';

    return new Promise(function (resolve, reject) {
        // Do async job

        request.get({
            url: First_Url,
            gzip: true
        }, function (error, response, body) {

            captchaid = body.replace('OK|', '');
            Sleep(10);
            var Second_Url = "http://2captcha.com/res.php?key=" + key + "&action=get&id=" + captchaid;

            request.get({
                url: Second_Url,
                gzip: true
            }, function (error, response, body) {
                responsee = body.replace('OK|', '');
                if (responsee == "CAPCHA_NOT_READY") {
                    Sleep(15);
                    request.get({
                        url: Second_Url,
                        gzip: true
                    }, function (error, response, body) {
                        responsee = body.replace('OK|', '');
                        if (responsee == "CAPCHA_NOT_READY") {
                            Sleep(15);
                            request.get({
                                url: Second_Url,
                                gzip: true
                            }, function (error, response, body) {
                                responsee = body.replace('OK|', '');
                                if (responsee == "CAPCHA_NOT_READY") {
                                    Sleep(15);
                                } else {
                                    // console.log(responsee);
                                }
                            });
                        } else {
                            // console.log(responsee);
                        }
                    });
                }
            });
            resolve(responsee);
        });
    })

}

function Sleep(seconds) {

    var waitTill = new Date(new Date().getTime() + seconds * 1000);
    while (waitTill > new Date()) {
    }
}

//print("exe start")
//open('cap-win32-x64/resources/app/abc.json', 'w').close()
//open('cap-win32-x64/resources/app/url.json', 'w').close()

//urllss = []
//urllss.append(checkout_url)
//with open('cap-win32-x64/resources/app/url.json', mode = 'wt') as myfile:
//myfile.write('\n'.join(urllss))

//newCaptcha = []
//#os.system("C:/Users/Amitesh/source/repos/Shopify/Shopify/cap-win32-x64/cap.exe")
//_thread.start_new_thread(OpenExe, (1,))
//s_tok = "null"
//#os.system('TASKKILL /F /IM "C:/Users/Amitesh/source/repos/Shopify/Shopify/cap-win32-x64/cap.exe"')
//while "03" not in s_tok:
//#with open('C:\Users\Amitesh\source\repos\Shopify\Shopify\cap-win32-x64\resources\app\abc.json', mode = 'wt') as myfile:
//with open('cap-win32-x64/resources/app/abc.json', 'r') as f:
//s_tok = f.read()

//cap_token = s_tok
//cap_token = cap_token.replace('"', '').replace('\n', '')


async function ElectronCaptcha(checkOutUrl) {

    let captchaToken = "";

    console.log("Step1")

    // working
    await fs.writeFile('../cap-win32-x641/resources/app/url.json', checkOutUrl, function () {
        console.log("Done..")
    });

    await exec('../cap-win32-x641\\cap.exe');

    setInterval(async function () {
        let data = Promise.resolve(readCsvFile());
        if (data) {
            console.log("chala " + JSON.stringify(data));
            // return data;
        } else {
            console.log("false" + data)
        }
    }, 999);

}

async function readCsvFile() {
    var csvData;
    const file = '../cap-win32-x641/resources/app/abc.json';
    await jsonfile.readFile(file, function (err, obj) {
        if (err) console.error(err)
        var data = JSON.stringify(obj);
        var newData = (JSON.parse(data));
        if (newData.data === undefined) {
            console.log("Undefined");
            csvData = false;
        } else {
            console.log("Data" + newData.data);
            csvData = newData.data;
        }
    });

    return csvData;

    // await fs.readFile('../cap-win32-x641/resources/app/abc.json', function (err, data) {
    //     if (err)
    //         console.log(err.message);
    //     else {
    //         console.log(JSON.stringify(data));
    //         if (Object.keys(data).length === 0 && data.constructor === Object) {
    //             console.log("if");
    //             return false;
    //         } else {
    //             console.log("else");
    //             return data;
    //         }
    //     }
    // });
}


function Search() {
    // Setting URL and headers for request

    var Search_KS = Search_Keyword.replace(' ', '+');
    var headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Referer': Website_DOMAIN,
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive'
    };

    time = (new Date()).getTime() / 1000;
    ts = parseInt(time);

    ts = ts.toString();
    random_number = Math.floor(Math.random() * 999 + 101);
    random_number = random_number.toString();
    ts = ts + random_number;

    //var ts = "1552384390567";
    var search_url = 'https://www.searchanise.com/getresults?api_key=3J2M9Q3r7i&q=' + Search_KS + '&sortBy=relevance&sortOrder=desc&startIndex=0&maxResults=45&items=true&pages=true&categories=true&suggestions=true&queryCorrection=true&suggestionsMaxResults=3&pageStartIndex=0&pagesMaxResults=20&categoryStartIndex=0&categoriesMaxResults=20&facets=true&facetsShowUnavailableOptions=true&ResultsTitleStrings=2&ResultsDescriptionStrings=0&output=jsonp&callback=jQuery111009158794206753316_' + ts + '&_=' + ts;
    //r = s.get(search_url, headers = headers, verify = False)

    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job

        request.get({
            url: search_url,
            gzip: true,
            headers: headers
        }, function (error, response, body) {

            if (error) {
                reject(error);
            } else {
                let search_text1 = body;
                start = 'jQuery111009158794206753316_' + ts + '('
                end = ');'
                search_text1 = (search_text1.split(start))[1]
                search_text1 = search_text1.split(end)[0]
                //console.log(search_text1);
                Json_Search = JSON.parse(search_text1);
                JsonSearch_Items = Json_Search['items'];
                Length_Items = JsonSearch_Items.length;
                if (Length_Items > 1) {
                    product_url = Json_Search['items'][0]['link']
                }
                resolve(product_url);
            }

        });


    })

}


async function Checkout() {

    var cpt = await ElectronCaptcha("https://shop.havenshop.com/517042/checkouts/a");
    console.log("Cpatacha token accessd before" + cpt);


    if (cpt) {
        console.log("Cpatacha token accessd after" + cpt);
        if (Search_Keyword !== "na") {

            Logs("search start")
            var product_url = await Search();
            var json_product_url = product_url + '.json';
            Logs("Product Url Found - " + json_product_url)

        }

        //var cap_token = await Twocaptcha('https://kith.com/942252/checkouts/0e8d729beb0db71df309c1e3eaf3732e');
        //console.log("Captcha await end");
        //console.log(cap_token);


        headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
            'Upgrade-Insecure-Requests': '1',
            'Connection': 'keep-alive'
        }

        request.get({
            url: json_product_url,
            gzip: true,
            headers: headers

        }, function (error, response, body) {
            fs.writeFile('temp.txt', body, function () {
            });
            var size_array = JSON.parse(body);
            var size_array2 = size_array['product']['variants'];
            var size = '';
            if (product_size) {
                var array_length = size_array2.length;
                for (i = 0; i < array_length; i++) {
                    sz = size_array2[i];

                    if (Website_DOMAIN == "https://yeezysupply.com") {
                        size = sz['public_title'];
                    } else {
                        size = sz['title'];

                    }

                    if (size == product_size) {
                        vid = sz['id'];
                        vid = vid.toString();
                        vid = vid.replace('L', '')
                    }


                }
            } else {
                vid = ss[0]['id'];
                vid = vid.toString();
                vid = vid.replace('L', '')
            }


            //vid = ss[0]['id'];
            //vid = '19251378946117';
            cc = response.headers['set-cookie'];
            headers2 = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': product_url,
                'Origin': Website_DOMAIN,
                'Connection': 'keep-alive',
                'Cookie': cc
            }


            request.post({
                url: 'https://kith.com/cart/add.js',
                gzip: true,
                headers: headers2,
                form: {'id': vid, 'quantity': '1', 'properties[upsell]': 'mens', 'option-0': '38'}
            }, function (error, response, body) {
                //global.ck = request.jar();
                cc = response.headers['set-cookie'];
                headers3 = {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': product_url,
                    'Origin': Website_DOMAIN,
                    'Upgrade-Insecure-Requests': '1',
                    'Connection': 'keep-alive',
                    'Cookie': cc
                }

                request.post({
                    url: 'https://kith.com/cart',
                    gzip: true,
                    followAllRedirects: true,
                    headers: headers3,
                    form: {'updates[]': '1', 'checkout': 'CHECKOUT'}
                }, function (error, response, body) {
                    //global.ck = response.headers['set-cookie'];
                    var souper = new JSSoup(body);
                    cc = response.headers['set-cookie'];
                    var authencity_token = souper.find('input', attrs = {'name': 'authenticity_token'});
                    Logs("Cart Added Successfully")
                    //var authencity_token = authencity_token['value'];
                    //var authencity_token = soup.find('input[name=authenticity_token]');
                    var at = authencity_token.attrs.value;
                    //var checkout_url = souper.find('a', attrs = { 'class': 'alt-payment-list__item__link' })
                    //checkout_url = checkout_url.attrs.href;
                    //checkout_url = checkout_url.replace('/express/redirect', '')


                    var checkout_url = souper.find('form', attrs = {'class': 'edit_checkout'})
                    checkout_url = checkout_url.attrs.action;
                    //checkout_url = checkout_url.replace('/express/redirect', '')


                    checkout_url = Website_DOMAIN + checkout_url;
                    var ReffUrl = checkout_url
                    headers5 = {
                        'Cache-Control': 'max-age=0',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': ReffUrl,
                        'Connection': 'keep-alive',
                        'Cookie': cc
                    }
                    var cap_token = '';

                    request.post({
                        url: checkout_url,
                        gzip: true,
                        followAllRedirects: true,
                        headers: headers5,
                        form: {
                            'utf8': '&#x2713',
                            '_method': 'patch',
                            'authenticity_token': at,
                            'previous_step': 'contact_information',
                            'step': 'shipping_method',
                            'checkout[email]': email,
                            'checkout[buyer_accepts_marketing]': '0',
                            'checkout[buyer_accepts_marketing]': '1',
                            'checkout[shipping_address][first_name]': first_name,
                            'checkout[shipping_address][last_name]': '',
                            'checkout[shipping_address][address1]': add1,
                            'checkout[shipping_address][address2]': '',
                            'checkout[shipping_address][city]': city,
                            'checkout[shipping_address][country]': country,
                            'checkout[shipping_address][province]': province,
                            'checkout[shipping_address][zip]': zip,
                            'checkout[shipping_address][phone]': phone,
                            'checkout[shipping_address][first_name]': first_name,
                            'checkout[shipping_address][last_name]': last_name,
                            'checkout[shipping_address][address1]': add1,
                            'checkout[shipping_address][address2]': '',
                            'checkout[shipping_address][city]': city,
                            'checkout[shipping_address][country]': country,
                            'checkout[shipping_address][province]': province,
                            'checkout[shipping_address][zip]': zip,
                            'checkout[shipping_address][phone]': phone,
                            'button': '',
                            'checkout[client_details][browser_width]': '1519',
                            'checkout[client_details][browser_height]': '759',
                            'checkout[client_details][javascript_enabled]': '1',
                            'g-recaptcha-response': cap_token
                        }

                    }, function (error, response, body) {
                        var souper = new JSSoup(body);
                        cc = response.headers['set-cookie'];
                        var authencity_token = souper.find('input', attrs = {'name': 'authenticity_token'});
                        var at = authencity_token.attrs.value;
                        var shipping_method = souper.find('div', attrs = {'class': 'radio-wrapper'});
                        var shipping_rate = shipping_method.attrs['data-shipping-method'];
                        Logs("Profile Added Successfully")
                        refurl = checkout_url + "?previous_step=contact_information&step=shipping_method"
                        headers6 = {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Accept-Language': 'en-US,en;q=0.8',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': refurl,
                            'Origin': Website_DOMAIN,
                            'Upgrade-Insecure-Requests': '1',
                            'Connection': 'keep-alive',
                            'Cookie': cc
                        }
                        request.post({
                            url: checkout_url,
                            gzip: true,
                            followAllRedirects: true,
                            headers: headers6,


                            form: {
                                'utf8': '?',
                                '_method': 'patch',
                                'authenticity_token': at,
                                'step': 'payment_method',
                                'checkout[shipping_rate][id]': shipping_rate,
                                'button': '',
                                'checkout[client_details][browser_width]': '1536',
                                'checkout[client_details][browser_height]': '759',
                                'checkout[client_details][javascript_enabled]': '1'
                            }
                        }, function (error, response, body) {
                            cc = response.headers['set-cookie'];
                            var souper = new JSSoup(body);
                            var authencity_token = souper.find('input', attrs = {'name': 'authenticity_token'});
                            var at = authencity_token.attrs.value;
                            var pid = '12807719';
                            var total_price = souper.find('span', attrs = {'class': 'total-recap__final-price'})
                            var tprice = total_price.attrs['data-checkout-payment-due-target']
                            start = 'Shopify.Checkout.token = "'
                            end = '";'
                            identifier = (souper.text.split(start))[1]
                            identifier = identifier.split(end)[0]
                            Logs("Shipping Added Successfully")
                            location = checkout_url + "?previous_step=shipping_method&step=payment_method"
                            dir = "ltr"
                            fonts = "Lato"
                            refurl2 = "https://checkout.shopifycs.com/number?identifier=" + identifier + "&location=" + location + "&dir=ltr&fonts[]=Lato"
                            headers7 = {
                                'Accept': 'application/json',
                                'Accept-Encoding': 'gzip, deflate, br',
                                'Accept-Language': 'en-US,en;q=0.8',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                                'Content-Type': 'application/json',
                                'Referer': refurl2,
                                'Origin': 'https://checkout.shopifycs.com',
                                'Host': 'elb.deposit.shopifycs.com',
                                'Connection': 'keep-alive'
                            };

                            request.post({
                                url: 'https://elb.deposit.shopifycs.com/sessions',
                                gzip: true,
                                followAllRedirects: true,
                                headers: headers7,


                                form: {
                                    'credit_card': {
                                        'month': expmonth,
                                        'name': cardname,
                                        'number': cardnumber,
                                        'verification_value': cardcvv,
                                        'year': expyear
                                    }
                                }
                            }, function (error, response, body) {

                                var souper = new JSSoup(body);
                                start = '{"id":"'
                                end = '"}'
                                sid = (souper.text.split(start))[1]
                                sid = sid.split(end)[0];
                                refurl3 = checkout_url + "?previous_step=shipping_method&step=payment_method"
                                headers8 = {
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'Accept-Language': 'en-US,en;q=0.8',
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                                    'Cache-Control': 'max-age=0',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Referer': refurl3,
                                    'Origin': 'SHOPIFY_DOMAIN',
                                    'Upgrade-Insecure-Requests': '1',
                                    'Connection': 'keep-alive',
                                    'Cookie': cc
                                };

                                request.post({
                                    url: checkout_url,
                                    gzip: true,
                                    followAllRedirects: true,
                                    headers: headers8,
                                    form: {
                                        'utf8': '?',
                                        '_method': 'patch',
                                        'authenticity_token': at,
                                        'previous_step': 'payment_method',
                                        'step': '',
                                        's': sid,
                                        'checkout[payment_gateway]': pid,
                                        'checkout[credit_card][vault]': 'false',
                                        'checkout[different_billing_address]': 'false',
                                        'checkout[remember_me]': '',
                                        'checkout[remember_me]': '0',
                                        'checkout[vault_phone]': phone,
                                        'checkout[total_price]': tprice,
                                        'complete': '1',
                                    }
                                }, function (error, response, body) {
                                    var souper = new JSSoup(body);
                                    var ss8 = souper.text
                                    if ((ss8.includes("Security code was not matched by the processor")) || (ss8.includes("Security code was not matched by the processor"))) {
                                        Logs("Cart Error")
                                    } else {
                                        Logs("Cart Error2")
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}

Checkout();


//request.post({
//    url: 'https://kith.com/cart',
//    gzip: true,
//    headers: headers3,
//    proxy: "http://127.0.0.1:8888",

//    form: { 'updates[]': '1', 'checkout': 'CHECKOUT' }
//}, function (error, response, body) {
//    console.log(body);
//});