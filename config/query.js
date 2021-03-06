const pool = require('./pg');

module.exports = function(queryText, queryValues, cb) {
    pool.connect(function(err, client, done) {

        if (err) return cb(err);
        client.query(queryText, queryValues, function(err, result) {
            console.log(err);
            done();

            if (err) return cb(err);

            return cb(null, result.rows, result);
        });
    });
};