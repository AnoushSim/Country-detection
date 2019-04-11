const nodeMailer = require('nodemailer');

exports.sendMail = (to, subject, text, filePath, cb) => {
    let transporter = nodeMailer.createTransport({
            service: 'Your service here',
            auth: {
                user: 'sender mail',
                pass: 'sender password'
            }
        }),
        options = {
            to: to,
            subject: subject
        };

    if (text.startsWith("<"))
        options.html = text;
    else
        options.text = text;

    if (typeof filePath === "function")
        cb = filePath;
    else if (filePath)
        options.attachments = [{
            path: filePath
        }];

    transporter.sendMail(options, function (error) {
        cb && cb(error);
    });
};