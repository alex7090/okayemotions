const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var query = require('../config/query');


module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            let errors = [];
            user = new Object()
            user.name = process.env.TMP_USER_NAME;
            user.id = process.env.TMP_USER_ID;
            if (password == process.env.TMP_USER_PASSWORD) {
                return done(null, user);
            } else {
                errors.push({ msg: 'Wrong password' });
                return done(null, false, { errors });
            }
            // query('SELECT * FROM public.user WHERE email=$1', [email], (err, rows) => {
            //     if (err) return done(null, false);
            //     if (rows.length > 0) {
            //         const first = rows[0]
            //         bcrypt.compare(password, first.password, (err, isMatch) => {
            //             if (err) throw err;
            //             if (isMatch) {
            //                 return done(null, first);
            //             } else {
            //                 errors.push({ msg: 'Please fill in all required fields' })
            //                 return done(null, false, {errors});
            //             }
            //         });
            //     } else {
            //         errors.push({ msg: 'That Email is not registered' })
            //         return done(null, false, {errors})
            //     }
            // });

        })
    );


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        user = new Object()
        user.name = process.env.TMP_USER_NAME;
        user.id = process.env.TMP_USER_ID;
        done(null, user)
        // query('SELECT * FROM public.user WHERE id = $1', [parseInt(id, 10)], (err, rows) => {
        //     if (err) return done(err);
        //     done(null, rows[0])
        // });
    });
}