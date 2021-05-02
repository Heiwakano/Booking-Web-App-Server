const nodemailer = require('nodemailer');
const db = require("../models");
const User = db.user;

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
        html: '<h1 style={{color: "#3b5998"}}> OTP : ' + data.digit + '</h1>' + '<h3> Ref : ' + data.char + '</h3>'
    };
    User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(user => {
          if (user.isActive) {
            transporter.sendMail(mailData, function (error, response) {
                if (error) {
                    console.log(error);
                    res.status(200).send({ message: "Can not send to this email: " + data.to})
                    //error handler
                } else {
                    //success handler 
                    res.send({otp: data.digit, ref: data.char});
                    res.status(200).send({ message: "Email send successfully", message_id: response.messageId })
                    console.log('send email success');
                }
            });
          } else {
            return res.status(400).send({
                message: "user is lock by admin."
              });
          }
      })
      .catch(err => {
        res.status(400).send({ message: "Can not find this email: " + data.to});
      });
   
}