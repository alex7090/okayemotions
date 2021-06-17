const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
var query = require('../config/query');


router.get('/' , (req, res) => {
    res.render('pages/password', {fixed: "false", user: req.user ? 'yes' : 'no'});

});

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/data',
        failureRedirect: '/auth',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', ensureAuthenticated, (req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/');
});


module.exports = router;