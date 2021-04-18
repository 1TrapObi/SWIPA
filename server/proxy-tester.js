const request = require('request');
const csv = require('csvtojson');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = async function proxyTester(req, res) {


    makeApiCalls(req.body);

    async function makeApiCalls(data) {
        for (let index = 0; index < data.length; index++) {
            let proxyId = data[index]['proxyData']['id'];
            let host = data[index]['proxyData']['0'];
            let port = data[index]['proxyData']['1'];
            let username = data[index]['proxyData']['2'];
            let password = data[index]['proxyData']['3'];
            try {
                await checkProxy(host, port, username, password, proxyId, data[1]['system_path']);
            } catch (e) {
                await changeProxyStatus(proxyId, "Error occured,Retry",data[1]['system_path']);
            }
        }
    }

    async function checkProxy(host, port, username, password, proxyId, system_path) {

        let proxyUrl = "";
        if (username && password) {
            proxyUrl = "http://" + username + ":" + password + "@" + host + ":" + port;
        } else {
            proxyUrl = "http://" + host + ":" + port;
        }

        let proxiedRequest = request.defaults({'proxy': proxyUrl});

        changeProxyStatus(proxyId, "Checking...", system_path);

        proxiedRequest.get("https://google.com", function (err, resp, body) {
            if (err) {
                changeProxyStatus(proxyId, "Not working",system_path);
            } else {
                if (resp.statusCode === 200)
                    changeProxyStatus(proxyId, "Working",system_path);
                else
                    changeProxyStatus(proxyId, "Not Working",system_path);
            }
        });
    }

    async function fetchProxyDataFromCsv(system_path) {
        let taskData = [];
        await csv()
            .fromFile(system_path + "/proxy-file.csv")
            .then((jsonObj) => {
                taskData = jsonObj;
            });
        return taskData;
    }

    async function changeProxyStatus(proxyId, status, system_path) {

        let taskDataResponse = await fetchProxyDataFromCsv(system_path);
        let isElementFound = false;
        let newTaskData = taskDataResponse;
        let deletedData = {};

        for (let index = 0; index < newTaskData.length; index++) {
            if (parseInt(newTaskData[index]['id']) === parseInt(proxyId)) {
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
            path: system_path + "/proxy-file.csv",
            header: [
                {id: 'ip_address', title: '0'},
                {id: 'port', title: '1'},
                {id: 'username', title: '2'},
                {id: 'password', title: '3'},
                {id: 'status', title: '4'},
                {id: 'id', title: 'id'}
            ]
        });

        for (let index = 0; index < newTaskData.length; index++) {
            newTaskData[index].ip_address = newTaskData[index][0];
            newTaskData[index].port = newTaskData[index][1];
            newTaskData[index].username = newTaskData[index][2];
            newTaskData[index].password = newTaskData[index][3];
            newTaskData[index].status = newTaskData[index][4];
            delete newTaskData[index][0];
            delete newTaskData[index][1];
            delete newTaskData[index][2];
            delete newTaskData[index][3];
            delete newTaskData[index][4];
        }

        csvWriter.writeRecords((newTaskData))       // returns a promise
            .then(() => {
                console.log('Editing done..');
            }).catch((e) => {
            console.log("Some error occured while writing data in CSV" + e.message);
        });
    }
};