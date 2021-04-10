module.exports = app => {
    const rooms = require("../controllers/room.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Room
    router.post("/", rooms.create);
  
    // Retrieve all Tutorials
    router.get("/", rooms.findAll);
  
    // // Retrieve all published Tutorials
    // router.get("/published", rooms.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", rooms.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", rooms.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", rooms.delete);
  
    // Delete all Tutorials
    router.delete("/", rooms.deleteAll);
  
    app.use('/api/rooms', router);
  };