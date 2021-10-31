var request = require('request');


async function doRequest(options) {
    try {
        return new Promise(function (resolve, reject) {
            request(options, function (error, res, body) {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    resolve(JSON.parse(body));
                } else {
                    resolve({error: res.body, code: res.statusCode});
                }
            });
        });
    } catch (error) {
        return error;
    }
}


module.exports = { doRequest }