module.exports = {
    searchHeader,
    cartHeader,
    cartHeader2,
    checkoutHeaders,
    checkoutHeaders2,
    paymentHeaders,
    paymentHeaders2
};


async function searchHeader() {
    return await {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Upgrade-Insecure-Requests': '1',
        'Connection': 'keep-alive'
    };
}

async function cartHeader(product_url,Website_DOMAIN,cc) {
    return await {
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
    };
}

async function cartHeader2(product_url,Website_DOMAIN,cc) {
    return await {
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
    };
}

async function checkoutHeaders(checkout_url,cc) {
    return await {
        'Cache-Control': 'max-age=0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': checkout_url,
        'Connection': 'keep-alive',
        'Cookie': cc
    };
}

async function checkoutHeaders2(cc,refurl,Website_DOMAIN) {
    return await {
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
    };
}

async function paymentHeaders(refurl2) {
    return await {
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
}

async function paymentHeaders2(refurl3,cc) {
    return await {
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
}