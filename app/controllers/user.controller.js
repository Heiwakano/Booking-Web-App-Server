const db = require("../models");
const User = db.user;
const Employee = db.employee;

var bcrypt = require("bcryptjs");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.updateEmployeeName = (req, res) => {
  const id = req.params.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const data = {
      firstName: firstname,
      lastName: lastname,
  }
  Employee.update(data, {
    where: { id: id },
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Employee was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Employee with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.updateOTP = (req, res) => {
  const email = req.params.email;
  const otp = req.body.otp;
  const otpRequestDate = req.body.otpRequestDate;
  const data = {
    otp: otp,
    otpRequestDate: otpRequestDate,
  }
  User.update(data, {
    where: { email: email }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with email=${email}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPassword = (req, res) => {
  const email = req.params.email;
  const password1 = req.body.password1;
  const password2 = req.body.password2;
  const otp = req.body.otp;
  const time = req.body.time;

  if (password1 !== password2) {
    res.status(401).send({ message: "Reset password and Confirm password must be the same." });
  } else {
    User.findAll({
      where: {
        email: email
      }
    }).then(data => {
      const otpRequestTime = new Date(data[0].otpRequestDate).getTime();
      const correctOTP = data[0].otp;
      if ((time - otpRequestTime) / (1000 * 60) > 15) {
        res.status(401).send({ message: "The OTP expired can not reset password." });
      }
      else {
        if (correctOTP === otp) {
          User.update({ 
            password: bcrypt.hashSync(password1, 8),
            loginAttempts: 0,
          }, {
            where: { email: email, otp: otp }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "New password was updated successfully."
                });
              } else {
                res.status(500).send({
                  message: `Cannot update password with email=${email}`
                });
              }
            })
            .catch(err => {
              res.status(500).send({ message: err.message });
            });
        }
        else {
          res.status(401).send({ message: "Incorrect OTP can not reset password." });
        }
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  }

  
  
};

exports.checkOTPUser = (req, res) => {
  const email = req.params.email;
  const otp = req.body.otp;
  const sendTime = req.body.sendTime;
  User.findAll({
    where: {
      email: email
    }
  })
    .then(data => {
      const otpRequestTime = new Date(data[0].otpRequestDate).getTime();
      const correctOTP = data[0].otp;
      if ((sendTime - otpRequestTime) / (1000 * 60) > 15) {
        console.log("The OTP expired");
        res.status(401).send({ message: "The OTP expired" });
      }
      else {
        if (correctOTP === otp) {
          console.log("Correct OTP");
          res.status(200).send({ otp: otp, username: data[0].username, time: sendTime,
            message: "Correct OTP" });
        }
        else {
          console.log("Incorrect OTP");
          res.status(401).send({ message: "Incorrect OTP" });
        }
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Find a user with a username
exports.userFindByUsername = (req, res) => {
  const username = req.params.username;

  User.findAll({
    where: {
      username: username
    },
    include: [Employee]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};