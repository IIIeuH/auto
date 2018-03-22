const express = require('express');
const router = express.Router();
const passport = require('../auth');
const ctrl = require('../controller/index');

/* GET home page. */
router.get('/', ctrl.main);
router.get('/box', ctrl.box);
router.get('/prepaid', ctrl.prepaid);
router.get('/other', ctrl.other);
//auth
router.get('/login', (req, res, next) => {
    console.log(req.flash('message'));
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

module.exports = router;
