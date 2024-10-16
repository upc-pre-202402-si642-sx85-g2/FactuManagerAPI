const mailer = require('nodemailer')

const transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'example@gmail.com',
        pass: 'example'
    }
});

module.exports = transporter;