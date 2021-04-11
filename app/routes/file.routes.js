module.exports = app => {
    const files = require("../controllers/file.controller.js");

    var router = require("express").Router();

    router.post("/upload", files.upload);
    router.get("/files", files.getListFiles);
    router.get("/files/:name", files.download);

    app.use('/api', router);
};