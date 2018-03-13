const express = require('express');
const router = express.Router();
const passport = require('../auth');
const ctrl = require('../controller/index');

/* GET home page. */
router.get('/', ctrl.main);

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
