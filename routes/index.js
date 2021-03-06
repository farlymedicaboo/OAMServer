var express = require('express'),
    router = express.Router(),
    wrap = require('co-express'),
    co = require('co'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty(),
    moment = require('moment');

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

    var firstPos = ambulansStations[23];

    console.log("testjj "+JSON.stringify(firstPos));
    // +" "+firstPos.posisi.lat+" "+firstPos.is_pos);

    res.render('index', {
        stations: ambulansStations,
        order: ambulansOrder,
        orderLength: orderLength,
        masyrakatLength: masyarakatLength
    });

}));

/* GET all order. */
router.get('/allorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find().sort([['_id', 'descending']]).populate('masyarakatId').exec();

    console.log("testgg "+JSON.stringify(orders));

    res.render('allorder', {
        order: orders
    });

}));


/* GET unhandled order. */
router.get('/unhandledorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find({status: "unhandled"}).sort([['_id', 'descending']]).populate('masyarakatId').exec();;

    res.render('unhandledorder', {
        order: orders
    });

}));


/* GET handled order. */
router.get('/handledorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find({status: "handled"}).sort([['_id', 'descending']]).populate('masyarakatId').exec();;

    res.render('handledorder', {
        order: orders
    });

}));

/* GET prank order. */
router.get('/outofcoverageorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find({status: "outofcoverage"}).sort([['_id', 'descending']]).populate('masyarakatId').exec();;

    res.render('outofcoverageorder', {
        order: orders
    });

}));

/* GET prank order. */
router.get('/declinedorder', auth.check, wrap(function *(req, res, next) {
    var orders = yield PesanAmbulans.find({status: "declined"}).sort([['_id', 'descending']]).populate('masyarakatId').exec();;

    res.render('declinedorder', {
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

//Declined
router.get('/setdeclined/:id', auth.check, function (req, res, next) {
    // var orders = yield PesanAmbulans.find({status: "handled"});

    // PesanAmbulans.findById(req.params.id, function (err, pesan) {
    //     console.log("testa hehehehe "+JSON.stringify(pesan));
    //
    //     pesan.status = 'declined';
    //     pesan.save(function (err, updatedTank) {
    //         console.log("testb "+JSON.stringify(updatedTank));
    //
    //         // res.redirect('/');
    //     });
    // });

    PesanAmbulans.update({ _id: req.params.id }, { $set: { status: 'declined' }}, function (err, data) {
        console.log("testc "+JSON.stringify(data));
        res.redirect('/');

    });
    
});

//Handled
router.get('/sethandled/:id', auth.check, function (req, res, next) {

    PesanAmbulans.update({ _id: req.params.id }, { $set: { status: 'handled' }}, function (err, data) {
        console.log("testr "+JSON.stringify(data));
        res.redirect('/');

    });

});

module.exports = router;
