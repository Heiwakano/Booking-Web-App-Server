var nodemailer = require('nodemailer');


exports.create = (req, res) => {
    const { to, subject, digit, char } = req.body;
    console.log(req.body);
    const transporter = nodemailer.createTransport({
        port: 465,               // true for 465, false for other ports
        host: "smtp.gmail.com",
        auth: {
            user: 'tempbooking01@gmail.com',
            pass: 'q1w2e3a4s5',
        },
        secure: true,
    });
    const mailData = {
        from: 'tempbooking01@gmail.com',  // sender address
        to: to,   // tempbooking02@gmail.com
        subject: subject,
        html: '<h1> OTP  '+ digit +'</h1>'+'<h2> Ref:'+ char +'</h2>'
    };
    transporter.sendMail(mailData, function (error, response) {
        if (error) {
            return console.log(error);
            //error handler
        } else {
            //success handler 
            res.status(200).send({message: "Mail send", message_id: response.messageId})
            console.log('send email success');
        }
    });
}