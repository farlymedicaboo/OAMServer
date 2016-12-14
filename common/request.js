/**
 * Created by kakek on 11/12/16.
 */

const
    request = require('request-promise'),
    config = require('./config');


const base_request = function(method, uri, token, data) {
    let options = {
        method: method,
        uri: uri,
        qs: {
            access_token: token
        },
        json: true
    };

    if (method == 'POST' || method == 'PUT') {
        options.body = data || {};
    }

    return request(options);
};

exports.get = function(uri, token) {
    return base_request('GET', config.medikaboo_base_url + uri, token);
};

exports.post = function(uri, data, token) {
    return base_request('POST', config.medikaboo_base_url + uri, token, data);
};

exports.put = function(uri, data, token) {
    return base_request('PUT', config.medikaboo_base_url + uri, token, data);
};

exports.delete = function(uri, token) {
    return base_request('DELETE', config.medikaboo_base_url + uri, token);
};