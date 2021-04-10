module.exports = app => {
    const statuses = require("../controllers/status.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Room
    router.post("/", statuses.create);
  
    // Retrieve all Tutorials
    router.get("/", statuses.findAll);
  
    // // Retrieve all published Tutorials
    // router.get("/published", statuses.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", statuses.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", statuses.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", statuses.delete);
  
    // Delete all Tutorials
    router.delete("/", statuses.deleteAll);
  
    app.use('/api/statuses', router);
  };