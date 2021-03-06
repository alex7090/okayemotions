const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
var query = require('../config/query');


module.exports = function(passport) {
    // Définition de la strategie Passport que nous utilisons, ici Local
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            let errors = [];
            // Query pour vérifier si l'utilisateur qui tente de se connecter existe
            query('SELECT * FROM public.user WHERE email=$1', [email], (err, rows) => {
                if (err) return done(null, false);

                // Si rows.length > 0 alors l'utilisateur existe
                if (rows.length > 0) {
                    const first = rows[0]
                        // Comparaison du mdp de la bdd avec celui renseigné par l'utilisateur
                    bcrypt.compare(password, first.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, first);
                        } else {
                            errors.push({ msg: 'Please fill in all required fields' })
                            return done(null, false, {errors});
                        }
                    });
                } else {
                    errors.push({ msg: 'That Email is not registered' })
                    return done(null, false, {errors})
                }
            });

        })
    );


    // Sérialisation de l'utilisateur ( lors de la connection )
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Désérialisation de l'utilisateur ( lors de la deconnection )
    passport.deserializeUser((id, done) => {
        query('SELECT * FROM public.user WHERE id = $1', [parseInt(id, 10)], (err, rows) => {
            if (err) return done(err);
            done(null, rows[0])
        });
    });
}