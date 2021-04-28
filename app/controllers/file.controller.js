const uploadFile = require("../middleware/upload");
const fs = require("fs");
const baseUrl = "http://localhost:8080/api/files/";
const file = require("../config/file.config");
const db = require("../models");
const Employee = db.employee;
const { v5: uuidv5 } = require('uuid');
const FILENAME = '1b671a64-40d5-491e-99b0-da01ff1f3341';
const upload = async (req, res) => {
  
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    Employee.update({
      profilePicture: baseUrl +"download/"+ uuidv5(req.file.originalname, FILENAME)
    }, {
      where: { id: req.body.id }
    })
      .then(num => {
        if (num == 1) {
          console.log("Employee was updated profilePicture successfully");
          
        } else {
          console.log("Cannot update Employee");
        }
      })
      .catch(err => {
        console.log(err);
      });


    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 5MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {

  const directoryPath = __basedir + file.profilePic

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + file.profilePic

  fs.readdir(directoryPath, function (err, files) {

    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    
    const filename = files.find((name) => {
      return uuidv5(name, FILENAME) === fileName
    });
    console.log(filename);
    res.download(directoryPath + filename, filename, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
    
  });

  
};

const getProfilePic = async (req, res) => {
  const email = req.params.email;

  Employee.findAll({ where: { email: email } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving employee."
      });
    });

};

module.exports = {
  upload,
  getListFiles,
  download,
  getProfilePic,
};