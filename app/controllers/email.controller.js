var nodemailer = require('nodemailer');


exports.create = (req, res) => {
    const ranNum = Math.floor(1000 + Math.random() * 9000);
    const makeid = (length) => {
        const result = [];
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    };

    const data = {
        to: req.body.email,
        subject: "Your OTP to reset password",
        digit: ranNum.toString(),
        char: makeid(4)
    };
    // const { to, subject, digit, char } = data;
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
        to: data.to,   // tempbooking02@gmail.com
        subject: data.subject,
        html: '<h1> OTP  ' + data.digit + '</h1>' + '<h2> Ref:' + data.char + '</h2>'
    };
    transporter.sendMail(mailData, function (error, response) {
        if (error) {
            return console.log(error);
            //error handler
        } else {
            //success handler 
            res.send(data.digit);
            res.status(200).send({ message: "Mail send", message_id: response.messageId })
            console.log('send email success');
        }
    });
}