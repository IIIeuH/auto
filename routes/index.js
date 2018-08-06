const express = require('express');
const router = express.Router();
const passport = require('../auth');
const ctrl = require('../controller/index');

/* GET home page. */
router.get('/', checkAuth, ctrl.main);
router.get('/box', checkAuth, ctrl.box);
router.get('/prepaid', checkAuth, ctrl.prepaid);
router.get('/score', checkAuth, ctrl.score);
router.get('/getJson', checkAuth, ctrl.getJson);
router.get('/defer', checkAuth, ctrl.defer);
router.get('/costs', checkAuth, ctrl.costs);
router.get('/dop', checkAuth, ctrl.dop);
router.get('/arbitrary', checkAuth, ctrl.arbitrary);
router.get('/listCar', checkAuth, ctrl.listCar);
//auth
router.get('/login', (req, res, next) => {
    res.render('login', {title: 'Авторизация', message: req.flash('message')});
});


router.post('/login',
    passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/login');
});

function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect('/login');
    }
}

module.exports = router;
