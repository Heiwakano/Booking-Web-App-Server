const util = require("util");
const multer = require("multer");
const maxSize = 5 * 1024 * 1024;
const files = require("../config/file.config");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + files.profilePic);
  },
  filename: (req, file, cb) => {
    // guid
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;