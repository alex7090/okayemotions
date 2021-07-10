  
const nodemailer = require('nodemailer');


var poolConfig = {
    pool: true,
    host: 'smtp.ionos.fr',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'alexandre@de-charry.com',
        pass: '/aF,eZL7aM+ctU&'
    }
};


var transporter = nodemailer.createTransport(poolConfig);

module.exports = transporter;