const crypto = require('crypto'),
    wrap = require('co-express'),
    path = require('path'),
    co = require('co'),
    fs = require('fs-extra'),
    request = require('request-promise'),
    moment = require('moment');

// const config = require('./config');
// const AccessData = require('../model/AccessData');

const dateToday = moment().format();
const expiredTime1H = moment().add(2, 'h').format();

exports.check = function (req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/masuk');
    }
};

// exports.checkConfig = function (req, res, next) {
//     if (req.session.idRs && req.session.isConfig == "OK") {
//         next();
//     } else {
//         res.redirect('/konfigurasi');
//     }
// };
//
// exports.isConfigured = function (req, res, next) {
//     if (req.session && req.session.isLoggedIn) {
//         if (req.session.isConfig == "1") {
//             next();
//         } else if (req.session.isConfig == "2") {
//             res.redirect('/konfigurasi/kamar');
//         } else if (req.session.isConfig == "3") {
//             res.redirect('/konfigurasi/dokter');
//         } else if (req.session.isConfig == "4") {
//             res.redirect('/konfigurasi/paket');
//         }
//     } else {
//         res.redirect('/masuk');
//     }
// };
//
// exports.isConfigured2 = function (req, res, next) {
//     if (req.session && req.session.isLoggedIn) {
//         if (req.session.isConfig == "2") {
//             next();
//         } else if (req.session.isConfig == "3") {
//             res.redirect('/konfigurasi/dokter');
//         } else if (req.session.isConfig == "4") {
//             res.redirect('/konfigurasi/paket');
//         } else if (req.session.isConfig == "1") {
//             res.redirect('/konfigurasi');
//         }
//     } else {
//         res.redirect('/masuk');
//     }
// };
//
// exports.isConfigured3 = function (req, res, next) {
//     if (req.session && req.session.isLoggedIn) {
//         if (req.session.isConfig == "3") {
//             next();
//         } else if (req.session.isConfig == "2") {
//             res.redirect('/konfigurasi/kamar');
//         } else if (req.session.isConfig == "4") {
//             res.redirect('/konfigurasi/paket');
//         } else if (req.session.isConfig == "1") {
//             res.redirect('/konfigurasi');
//         }
//     } else {
//         res.redirect('/masuk');
//     }
// };
//
// exports.isConfigured4 = function (req, res, next) {
//     if (req.session && req.session.isLoggedIn) {
//         if (req.session.isConfig == "4") {
//             next();
//         } else if (req.session.isConfig == "3") {
//             res.redirect('/konfigurasi/dokter');
//         } else if (req.session.isConfig == "2") {
//             res.redirect('/konfigurasi/kamar');
//         } else if (req.session.isConfig == "1") {
//             res.redirect('/konfigurasi');
//         }
//     } else {
//         res.redirect('/masuk');
//     }
// };

// exports.apiLogin = wrap(function *() {
//     var token = yield request({
//         uri: config.medikaboo_base_url + '/Masyarakats/login',
//         method: 'POST',
//         body: {
//             email: config.medikaboo_username,
//             password: config.medikaboo_password
//         },
//         json: true
//     });
//
//     return token.id;
// });
//
// exports.apiLogout = function (token) {
//     co(function *() {
//         yield request({
//             uri: config.medikaboo_base_url + '/Masyarakats/logout',
//             method: 'POST',
//             qs: {
//                 access_token: token
//             },
//             json: true
//         });
//     });
// };

exports.hashPass = function (pass) {
    const hash = crypto.createHmac('sha256', pass)
        .update('Medicaboo is Great')
        .digest('hex');
    return hash;
};

function generateUUID() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 10;
    var uuid = '';

    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        uuid += chars.substring(rnum, rnum + 2);
    }
    return uuid;
};

function getMiniUID() {
    var chars = "0123456789";
    var string_length = 3;
    var miniUID = '';

    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        miniUID += chars.substring(rnum, rnum + 1);
    }
    return miniUID;
};

exports.getUID = function () {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 10;
    var uuid = '';

    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        uuid += chars.substring(rnum, rnum + 2);
    }
    return uuid;
};


// exports.tokenForgotPass = wrap(function *(req, res, next) {
//     var FrontMask = generateUUID();
//     var BackMask = generateUUID();
//     var MiddleMask = generateUUID();
//     var StartCode = "h3l1oW012lDw3412eM3d1c4bo0Y01112p4rT1";
//     var EndCode = "1e121nH34Lth111aN49eM311Tc012p0124t10n";
//     var SuperAuthCode = FrontMask + StartCode + MiddleMask + EndCode + BackMask;
//     var cekUser = yield AccessData.findOne({username: req.body.username}).exec();
//
//     if (cekUser) {
//         var cekEmail = yield AccessData.findOne({username: req.body.username, email: req.body.email}).exec();
//         if (cekEmail) {
//             var GetAuth = yield forgotPassLog.create({
//                 targetFor: req.body.email,
//                 authCode: SuperAuthCode,
//                 timeStamp: expiredTime1H
//             });
//             req.tokenKM = SuperAuthCode;
//             next();
//         } else {
//             req.add_flash('danger', 'Email Tidak Ditemukan');
//             res.redirect('/lupa');
//         }
//     } else {
//         req.add_flash('danger', 'Username Tidak Ditemukan');
//         res.redirect('/lupa');
//     }
// });
//
// exports.cekTokenForgot = wrap(function *(req, res, next) {
//     var cekToken = yield forgotPassLog.findOne({targetFor: req.params.mail, authCode: req.params.tokenKM}).exec();
//
//     if (!cekToken) {
//         res.redirect('/masuk');
//     } else {
//         if (cekToken.timeStamp < dateToday) {
//             res.redirect('/masuk');
//         } else {
//             var cekMail = yield AccessData.findOne({email: req.params.mail}).exec();
//
//             if (!cekMail) {
//                 res.redirect('/masuk');
//             } else {
//                 next();
//             }//cekEmail
//         }
//     }//cekToken
// });
//
// exports.deleteToken = wrap(function *(tokenKM, data, next) {
//     yield forgotPassLog.remove({targetFor: data, authCode: tokenKM});
// });
//
// //LOG
// exports.getLog = wrap(function *(username, ip, data, next) {
//     logFactory.create({
//         user: username,
//         ip: ip,
//         timeStamp: moment().format('Do MMMM YYYY, h:mm:ss a'),
//         target: data
//     });
// });
//
// exports.cekKeybooPanel = function (req, res, next) {
//     if (config.booPanel_key == req.params.key) {
//         next();
//     } else {
//         res.json({msg: "Failed Access"})
//     }
// };
//
// exports.cekKeyService = function (req, res, next) {
//     if (config.service_key == req.params.key) {
//         next();
//     } else {
//         res.json({msg: "Failed Access"})
//     }
// };
//
// exports.idINPATIENT = function (codeRs) {
//     var dateNow = moment().format("DDMMYY");
//     var id = codeRs.toUpperCase() + "I" + dateNow + getMiniUID();
//
//     return id;
// };
//
// exports.idPATIENT = function (codeRs) {
//     var dateNow = moment().format("DDMMYY");
//     var id = codeRs.toUpperCase() + "P" + dateNow + getMiniUID();
//
//     return id;
// };
//
// exports.pushNotif = wrap(function *(idRs, title, idRef, note) {
//     NotifCenter.create({
//         idRs: idRs,
//         title: title,
//         urlRef: idRef,
//         note: note
//     });
// });
