const db = require("../models");
const User = db.user;

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


exports.updateOTP = (req, res) => {
  const email = req.params.email;
  User.update(req.body, {
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
      res.status(500).send({
        message: "Error updating User with email=" + email
      });
    });
};

exports.updateLoginAttempts = (req, res) => {
  const username = req.params.username;
  User.update(req.body, {
    where: { username: username }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with username=${username}. `
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with username=" + username
      });
    });
};

exports.resetPassword = (req, res) => {
  const email = req.params.email;
  const password = req.body.password;
  const otp = req.body.otp;
  User.update({ password: bcrypt.hashSync(password, 8) }, {
    where: { email: email, otp: otp }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "New password was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update password with email=${email}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating password with email=" + email
      });
    });
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
        res.send({ otp: otp, type: "TimeOut" });
      }
      else {
        if (correctOTP === otp) {
          res.send({ otp: otp, type: "Correct", username: data[0].username });
        }
        else {
          res.send({ otp: otp, type: "Wrong" });
        }
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with email=" + email
      });
    });
};

// Find a user with a username
exports.userFindByUsername = (req, res) => {
  const username = req.params.username;

  User.findAll({
    where: {
      username: username
    }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with username=" + username
      });
    });
};