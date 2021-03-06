const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
const passport = require('passport');
var query = require('../config/query');

router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

router.post('/register', (req, res) => {
    var { username, email, password, password2 } = req.body;
    let errors = [];
    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all required fields' })
    }

    if (password !== password2) {
        errors.push({ msg: "Passwords do not match" })
    }

    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2,
        });
    }
    else {
        query("select exists(select 1 from public.user where email='" + email + "')", [], (err, rows) => {
            if (err) return next(err);
            if (rows[0].exists == true) {
                errors.push({ msg: "Email is already used" })
                res.send("Email is already used");
            } else {
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        //Set Password to Hash
                        var new_password = hash;
                        //Save the User
                        var queryValues2 = [];
                        query("INSERT INTO public.user (email, password) values('" + email + "', '" + new_password + "')", queryValues2, (err, rows) => {
                            if (err) return next(err);
                            res.redirect('/user/login');
                        });
                    }));
            }
        });
    }
});

router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/auth');
});

router.get('/profil', ensureAuthenticated, (req, res) => {
    console.log(req.user);
    if (req.user.groupe == "Admin") {
        var queryValues = [];
        query("SELECT * FROM public.user ORDER BY id", queryValues, (err, rows) => {
            if (err) return next(err);
            res.render('profile_admin', {
                result: rows
            });
        });
    } else {
        res.render('profile_user');
    }
});



module.exports = router;