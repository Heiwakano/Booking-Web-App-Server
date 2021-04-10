module.exports = app => {
  const bookings = require("../controllers/booking.controller.js");

  var router = require("express").Router();

  // Create a new Booking
  router.post("/", bookings.create);

  // Retrieve all Tutorials
  router.get("/", bookings.findAll);

  //Retrieve the cheapest room for booking.
  router.post("/findCheapest", bookings.findCheapest);

  //Retrieve a single Booking include rooms and status with id
  router.get("/:id", bookings.findBooking);

  // Update a Booking with id
  router.put("/:id", bookings.updateBooking);

  // // Update a Room with id
  // router.put("/:id", bookings.updateRoom);

  // // Update a Status with id
  // router.put("/:id", bookings.updateStatus);

  // Delete a Booking with id
  router.delete("/:id", bookings.deleteBooking);

  // // Delete a Room with id
  // router.delete("/:id", bookings.deleteRoom);

  // // Delete a Status with id
  // router.delete("/:id", bookings.deleteStatus);

  // // Delete all Bookings
  // router.delete("/", bookings.deleteAllBookings);

  // // Delete all Rooms
  // router.delete("/", bookings.deleteAllRooms);

  // // Delete all Statuses
  // router.delete("/", bookings.deleteAllStatuses);

  app.use('/api/bookings', router);
};
