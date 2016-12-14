var express = require('express'),
    router = express.Router(),
    wrap = require('co-express'),
    co = require('co'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

router.use(multipartyMiddleware);

const auth = require('../common/auth');

const PosAmbulans = require('../model/PosAmbulans');
const PesanAmbulans = require('../model/PesanAmbulans');
const Masyarakat = require('../model/Masyarakat');
const AdminAmbulans = require('../model/AdminAmbulans');

/* GET home page. */
router.get('/', auth.check, wrap(function *(req, res, next) {
    var ambulansStations = yield PosAmbulans.find({});
    var ambulansOrder = yield PesanAmbulans.find({});
    var masyarakat = yield Masyarakat.find({});
    var orderLength = ambulansOrder.length;
    var masyarakatLength = masyarakat.length;

    res.render('index', {
        stations: ambulansStations,
        order: ambulansOrder,
        orderLength: orderLength,
        masyrakatLength: masyarakatLength
    });

}));

/* GET all order. */
router.get('/allorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find({});

    res.render('allorder', {
        order: orders
    });

}));


/* GET unhandled order. */
router.get('/unhandledorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find({status: "unhandled"});

    res.render('unhandledorder', {
        order: orders
    });

}));


/* GET handled order. */
router.get('/handledorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find({status: "handled"});

    res.render('handledorder', {
        order: orders
    });

}));

/* GET prank order. */
router.get('/prankorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find({status: "prank"});

    res.render('prankorder', {
        order: orders
    });

}));

/* GET agd station. */
router.get('/agd-station', auth.check, wrap(function *(req, res, next) {
    var ambulansStations = yield PosAmbulans.find({});

    res.render('agd-station', {
        stations: ambulansStations
    });

}));

/* GET user. */
router.get('/users', auth.check, wrap(function *(req, res, next) {
    var users = yield Masyarakat.find({});

    res.render('users', {
        users: users
    });

}));

// AUTHENTICATIONS
router.get('/masuk', function (req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        res.redirect('/');
    } else {
        res.render('masuk');
    }
});

router.post('/masuk', wrap(function *(req, res, next) {
    console.log("testaa "+JSON.stringify(req.body));

    if (!req.body || req.body == null || req.body.length < 1){
        req.add_flash('danger', 'Mohon pastikan username dan password anda telah terisi');
        res.redirect('/masuk');
    }

    var usr = req.body.username, pass = req.body.password;
    var user = usr.toLowerCase();
    console.log("testab "+usr+" v "+pass);

    const hashed = auth.hashPass(pass);
    console.log("testac "+hashed);

    var userData = yield AdminAmbulans.findOne({username: user});

    console.log("testa " + JSON.stringify(userData) + " " + hashed + " v ");

    if (!userData) {
        console.log("testb " + JSON.stringify(userData) + " " + hashed + " v ");
        req.add_flash('danger', 'Username Salah');
        res.redirect('/masuk');
    } else {
        if (hashed == userData.password) {
            console.log("testc " + JSON.stringify(userData) + " " + hashed + " v ");
            req.session.isLoggedIn = true;
            req.session.username = userData.username;
            res.redirect('/');

        } else {
            console.log("testd " + JSON.stringify(userData) + " " + hashed + " v ");
            req.add_flash('danger', 'Password Salah');
            res.redirect('/masuk');
        }
    }
}));

router.get('/keluar', auth.check, function (req, res, next) {
    req.session = null;
    res.redirect('/masuk');
});
// AUTHENTICATIONS

//Register
router.get('/daftar', function (req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        res.redirect('/');
    } else {
        res.render('daftar');
    }
});

router.post('/daftar', wrap(function *(req, res, next) {
    var body = req.body;
    var allU = yield AdminAmbulans.find({username: body.username});

    if (!allU || allU == null || allU.length < 1) {

        var pass = auth.hashPass(body.password);
        var hasil = yield AdminAmbulans.create({
            username: body.username,
            password: pass
        });

        req.add_flash('success', 'Akun Rumah sakit sudah terdaftar, silahkan masuk menggunakan akun anda.');
        res.redirect('/masuk');

    } else {

        req.add_flash('danger', 'Username Sudah Ada, Silahkan Ganti Dengan Username Yang Lain');
        res.redirect('/daftar');

    }

}));
//Register

module.exports = router;
