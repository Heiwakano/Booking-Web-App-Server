const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Employee = db.employee;
const { userEntity }  = require("../Entities/userEntity");
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  const userModel = new userEntity();
  userModel.username = req.body.username;
  userModel.email = req.body.email;
  userModel.password = bcrypt.hashSync(req.body.password, 8);
  userModel.loginAttempts = 0;
  userModel.isActive = true;
  userModel.createBy = "user";
  userModel.updateBy = "user";
  userModel.employees = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    profilePicture: 'http://localhost:8080/api/files/download/blank-profile-picture.png',
  };
  userModel.role = req.role;

  User.create(userModel, {
    include: [Employee]
  })
    .then(user => {
      // console.log("user", user);
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    },include: Employee
  })
    .then(user => {
     
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (!user.isActive) {
        return res.status(400).send({
          accessToken: null,
          message: "user is lock by admin."
        });
      }

      if (user.loginAttempts > 3) {
        return res.status(400).send({
          accessToken: null,
          message: "user is lock please reset password"
        });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
       
        data = {
          loginAttempts: user.loginAttempts + 1,
          lastLoginAttempsDate: new Date(),
        };
        User.update(data, {
          where: { username: user.username }
        })
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });

      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      User.update({lastLoginDate: new Date()}, {
        where: { username: user.username }
      })

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }
        res.status(200).send({
          id: user.id,
          firstname: user.employees[0].firstName,
          lastname: user.employees[0].lastName,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          profilePicture: user.employees[0].profilePicture,
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};