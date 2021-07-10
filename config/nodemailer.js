  
const nodemailer = require('nodemailer');


var poolConfig = {
    pool: true,
    host: 'smtp.ionos.fr',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_NAME,
        pass: process.env.MAIL_PW,
    }
};


var transporter = nodemailer.createTransport(poolConfig);

module.exports = transporter;