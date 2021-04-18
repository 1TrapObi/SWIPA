module.exports = {
    checkoutFormData,
    checkoutFormData2,
    paymentFormData,
    paymentFormData2
};


async function checkoutFormData(at, email, first_name, add1, city, country, province, zip, phone, last_name, cap_token) {
    return {
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
}

async function checkoutFormData2(at, shipping_rate) {
    return {
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
}

async function paymentFormData(expmonth, cardname, cardnumber, cardcvv, expyear) {
    return {
        'credit_card': {
            'month': expmonth,
            'name': cardname,
            'number': cardnumber,
            'verification_value': cardcvv,
            'year': expyear
        }
    }
}

async function paymentFormData2(at, sid, pid, phone, tprice) {
    return {
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
}