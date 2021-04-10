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


  exports.updateUser = (req, res) => {
    const username = req.params.username;
    const password = req.body.password;
    console.log(password?password:"no passwprd");
    User.update(password?{password: bcrypt.hashSync(password, 8)}:req.body, {
        where: { username: username }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe Booking was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
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