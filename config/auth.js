module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.session.sessionFlash = {
            type: 'info',
            message: 'Please, login to access the data'
        }
        res.redirect('/auth/');
    }
}