module.exports = app => {
  const rooms = require("../controllers/room.controller.js");
  const { param, check, validationResult } = require('express-validator');
  var router = require("express").Router();
  const db = require("../models");
  const Room = db.rooms;
  // Create a new Room
  router.post("/",
    async (req, res, next) => {
      try {
        await check('RoomNumber').notEmpty().withMessage('need a room number.').matches(/^\d+$/).withMessage('Room Number must be a number.').isLength({ max: 3, min: 3 }).withMessage('room number must be 3 chars long.').run(req);
        await check('AdultsCapacity').notEmpty().withMessage('need a adults capacity.').matches(/^\d+$/).withMessage('adults capacity must be a number.').run(req);
        await check('ChildrenCapacity').notEmpty().withMessage('need a children capacity.').matches(/^\d+$/).withMessage('children capacity must be a number.').run(req);
        await check('Price').notEmpty().withMessage('need a price.').matches(/^\d{1,}(?:\.\d{1,2})?$|^\.\d{1,2}$/).withMessage('Price must be a 2 decimal digits.').run(req);

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

    rooms.create);

  // Retrieve all Tutorials
  router.get("/", rooms.findAll);

  // // Retrieve all published Tutorials
  // router.get("/published", rooms.findAllPublished);

  // Retrieve a single room with id
  router.get("/:id", 
  async (req, res, next) => {
    try {
      await param('id').custom(value => {
        return Room.findByPk(value).then(room => {
          if (!room) {
            return Promise.reject('Invalid room id.');
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
  
  rooms.findOne);


  // Update a Tutorial with id
  router.put("/:id",
    async (req, res, next) => {
      try {
        await param('id').custom(value => {
          return Room.findByPk(value).then(room => {
            if (!room) {
              return Promise.reject('Invalid room id.');
            } 
          });
        }).run(req);
        await check('RoomNumber').notEmpty().withMessage('need a room number.').matches(/^\d+$/).withMessage('Room Number must be a number.').isLength({ max: 3, min: 3 }).withMessage('room number must be 3 chars long.').run(req);
        await check('AdultsCapacity').notEmpty().withMessage('need a adults capacity.').matches(/^\d+$/).withMessage('adults capacity must be a number.').run(req);
        await check('ChildrenCapacity').notEmpty().withMessage('need a children capacity.').matches(/^\d+$/).withMessage('children capacity must be a number.').run(req);
        await check('Price').notEmpty().withMessage('need a price.').matches(/^\d{1,}(?:\.\d{1,2})?$|^\.\d{1,2}$/).withMessage('Price must be a 2 decimal digits.').run(req);

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
    rooms.update);

  // Delete a room with id
  router.delete("/:id", 
  async (req, res, next) => {
    try {
      await param('id').custom(value => {
        return Room.findByPk(value).then(room => {
          if (!room) {
            return Promise.reject('Invalid room id.');
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
  rooms.delete);


  // Delete all room
  router.delete("/", rooms.deleteAll);

  app.use('/api/rooms', router);
};