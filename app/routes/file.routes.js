module.exports = app => {
    const files = require("../controllers/file.controller.js");

    var router = require("express").Router();

    router.post("/upload", files.upload);
    router.get("/files/:email", files.getProfilePic);
    router.get("/files", files.getListFiles);
    router.get("/get/profilePicture/:name", files.download);

    app.use('/api', router);
};