module.exports = app => {
    const emails = require("../controllers/email.controller.js");
  
    var router = require("express").Router();
  
    
    router.post("/", emails.create);
  
    app.use('/api/text-mail', router);
  };