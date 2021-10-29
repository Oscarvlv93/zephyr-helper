var request = require('request');


async function doRequest(options) {
    try {
        return new Promise(function (resolve, reject) {
            request(options, function (error, res, body) {
                if (!error && res.statusCode == 200 || 201) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    } catch (error) {
        return error;
    }
}


module.exports = { doRequest }