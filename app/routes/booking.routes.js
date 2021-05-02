module.exports = app => {
  const bookings = require("../controllers/booking.controller.js");
  const db = require("../models");
  const Room = db.rooms;
  const Status = db.statuses;
  const Booking = db.bookings;
  var router = require("express").Router();
  const { body, check, validationResult } = require('express-validator');
  // Create a new Booking
  router.post("/", 
  async (req, res, next) => {
    try {
      await check('GuestLastName').notEmpty().withMessage('need a last name.').matches(/^[a-zA-Z ]*$/).withMessage('last name must be a english character.').run(req);
      await check('GuestFirstName').notEmpty().withMessage('need a first name.').matches(/^[a-zA-Z ]*$/).withMessage('first name must be a english character.').run(req);
      await check('CheckInDate').notEmpty().withMessage('need a check-in date.').isDate().withMessage('check-in date must be a date(yyyy-mm-dd).').run(req);
      await check('CheckOutDate').notEmpty().withMessage('need a check-out date.').isDate().withMessage('check-out date must be a date(yyyy-mm-dd).').custom(
        (value, { req }) => {
            if (value < req.body.CheckInDate) {
              throw new Error('Check Out must more than Check In.');
            }
            return true;
      })
      .run(req);
      await check('NumberOfChildren').notEmpty().withMessage('need a number of children.').matches(/^\d+$/).withMessage('number of children must be a number.').run(req);
      await check('NumberOfAdults').notEmpty().withMessage('need a number of adults.').matches(/^\d+$/).withMessage('number of adults must be a 2 decimal digits.').isInt({ min: 1}).withMessage('minimum of the number of adults is 1.').run(req);
      await check('roomId').custom(value => {
        return Room.findByPk(value).then(room => {
          if (!room) {
            return Promise.reject('Invalid room id.');
          } 
        });
      }).run(req);
      await check('statusId').custom(value => {
        return Status.findByPk(value).then(status => {
          if (!status) {
            return Promise.reject('Invalid status id.');
          } 
        });
      }).run(req);

      const results = validationResult(req);

      if (!results.isEmpty()) {
        results.errors.map(result => {
          const message = result.msg;
          res.status(400).send({
            message: message
          });
        })
        return;
      }

      next();
    } catch (error) {
      return next(error)
    }

  },
  bookings.create);

  // Retrieve all Tutorials
  router.get("/", bookings.findAll);

  //Retrieve the cheapest room for booking.
  router.post("/findCheapest", bookings.findCheapest);

  //Retrieve a single Booking include rooms and status with id
  router.get("/:id", 
  async (req, res, next) => {
    try {
      await param('id').custom(value => {
        return Booking.findByPk(value).then(room => {
          if (!room) {
            return Promise.reject('Invalid boooking id.');
          } 
        });
      }).run(req);

      const results = validationResult(req);
      console.log(results);
      if (!results.isEmpty()) {
        results.errors.map(result => {
          const message = result.msg;
          res.status(400).send({
            message: message
          });
        })
        return;
      }

      next();
    } catch (error) {
      return next(error)
    }

  },
  bookings.findBooking);

  // Update a Booking with id
  router.put("/:id", 
  async (req, res, next) => {
    try {
      await param('id').custom(value => {
        return Booking.findByPk(value).then(room => {
          if (!room) {
            return Promise.reject('Invalid boooking id.');
          } 
        });
      }).run(req);

      const results = validationResult(req);
      console.log(results);
      if (!results.isEmpty()) {
        results.errors.map(result => {
          const message = result.msg;
          res.status(400).send({
            message: message
          });
        })
        return;
      }

      next();
    } catch (error) {
      return next(error)
    }

  },
  bookings.updateBooking);

  // Delete a Booking with id
  router.delete("/:id", 
  async (req, res, next) => {
    try {
      await param('id').custom(value => {
        return Booking.findByPk(value).then(room => {
          if (!room) {
            return Promise.reject('Invalid boooking id.');
          } 
        });
      }).run(req);

      const results = validationResult(req);
      console.log(results);
      if (!results.isEmpty()) {
        results.errors.map(result => {
          const message = result.msg;
          res.status(400).send({
            message: message
          });
        })
        return;
      }

      next();
    } catch (error) {
      return next(error)
    }

  },
  bookings.deleteBooking);

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
