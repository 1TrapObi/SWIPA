const Apis = {

    async HttpGetRequest(link) {
        try {
            let response = await
                fetch(link,
                    {
                        mode: 'cors',
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                );
            return await response.json();
        } catch (error) {
            return error;
        }
    },

    async HttpPostRequest(link, dataObj) {
        try {
            let response = await
                fetch(link, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataObj)
                });
            return await response.json();
        } catch (error) {
            return error;
        }
    },

    async HttpPostRequestForLogin(link, dataObj) {
        try {
            let response = await
                fetch(link, {
                    crossDomain: true,
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataObj)
                });
            return await response.json();
        } catch (error) {
            return error;
        }
    }


};

export default Apis;
