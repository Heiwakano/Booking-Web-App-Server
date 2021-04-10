const db = require("../models");
const Booking = db.bookings;
const Room = db.rooms;
const Status = db.statuses;
const Op = db.Sequelize.Op;
const { QueryTypes } = require('sequelize');

// Create and Save a new Booking
exports.create = (req, res) => {
    // Validate request
    if (!req.body.GuestLastName) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Booking
    const booking = {
        GuestLastName: req.body.GuestLastName,
        GuestFirstName: req.body.GuestFirstName,
        CheckInDate: req.body.CheckInDate,
        CheckOutDate: req.body.CheckOutDate,
        NumberOfAdults: req.body.NumberOfAdults,
        NumberOfChildren: req.body.NumberOfChildren,
        roomId: req.body.roomId,
        statusId: req.body.statusId,
    };

    // Save Booking in the database
    Booking.create(booking)
        .then(data => {
            console.log(">> Created Booking: " + JSON.stringify(Booking, null, 4));
            res.send(data);
        })
        .catch(err => {
            console.log(">> Error while creating Booking: ", err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Booking."
            });
        });
};


// Retrieve all Bookings include room and statusfrom the database.
exports.findAll = async (req, res) => {

    const name = req.query.Name;
    const status = req.query.Status;
    const isHaveNameAndStatus = typeof name === 'string' && typeof status === 'string';
    const onlyHasName = typeof name === 'string' && typeof status !== 'string';
    const onlyHasStatus = typeof name !== 'string' && typeof status == 'string';
    var condition = isHaveNameAndStatus ? "(bookings.GuestFirstName = " + '"' + name + '"' + " or bookings.GuestLastName = " + '"' + name + '"' + ") and statuses.id = " + status 
        : onlyHasName?"bookings.GuestFirstName = " + '"' + name + '"' + " or bookings.GuestLastName = " + '"' + name + '"'
        : onlyHasStatus?"statuses.id = " +  status :"bookings.id IS NOT NULL";

    await db.sequelize.query(
        "SELECT GuestLastName,GuestFirstName, CheckOutDate,CheckInDate,RoomNumber,Label,bookings.id FROM ((bookings INNER JOIN statuses ON bookings.statusId = statuses.id) INNER JOIN rooms ON bookings.roomId = rooms.id) where " + condition,
        {
            type: QueryTypes.SELECT
        }
    )
        .then(data => {
            console.log("findAll");
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding booking."
            });
        })
};




//
exports.findCheapest = async (req, res) => {

    const NumberOfAdults = parseInt(req.body.NumberOfAdults);
    const NumberOfChildren = parseInt(req.body.NumberOfChildren);
    const CheckInDate = req.body.CheckInDate;
    const CheckOutDate = req.body.CheckOutDate;


    await db.sequelize.query(
        "SELECT * FROM rooms WHERE :NumberOfAdults > 0 AND rooms.AdultsCapacity >= :NumberOfAdults AND rooms.AdultsCapacity + rooms.ChildrenCapacity >= :NumberOfAdults + :NumberOfChildren AND NOT EXISTS (SELECT * FROM bookings WHERE bookings.roomId = rooms.id AND (:CheckInDate BETWEEN bookings.CheckInDate AND DATE_SUB(bookings.CheckOutDate, INTERVAL 1 DAY) OR :CheckOutDate BETWEEN DATE_ADD(bookings.CheckInDate, INTERVAL 1 DAY) AND bookings.CheckOutDate) AND " +
        "bookings.statusId <> 4) " +
        "ORDER BY rooms.Price ASC LIMIT 1;",
        {
            replacements: {
                NumberOfAdults: NumberOfAdults,
                NumberOfChildren: NumberOfChildren,
                CheckInDate: CheckInDate,
                CheckOutDate: CheckOutDate,
            },
            type: QueryTypes.SELECT
        }
    )
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding the cheapest room."
            });
        })

}
//Find booking by id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Booking.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Booking with id=" + id
        });
      });
};

//Find booking with room and status by id 
exports.findBooking = async (req, res) => {
    const id = req.params.id;
    await db.sequelize.query(
        "SELECT bookings.id,GuestLastName,GuestFirstName,CheckInDate,CheckOutDate,NumberOfAdults,NumberOfChildren,RoomNumber,Price,Label "+ 
        "FROM (bookings "+
        "INNER JOIN rooms ON bookings.roomId=rooms.id) "+
        "INNER JOIN statuses ON bookings.statusId=statuses.id "+
        "WHERE bookings.id="+ id +";",
        {
            // replacements: {
            //     id: id,
            // },
            type: QueryTypes.SELECT
        }
    )
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding the booking with room and status by id."+ id
            });
        })

}

// Update a Booking by the id in the request
exports.updateBooking = (req, res) => {
    const id = req.params.id;

    Booking.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Booking was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Booking with id=${id}. Maybe Booking was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Booking with id=" + id
            });
        });
};

// Delete a Booking with the specified id in the request
exports.deleteBooking = (req, res) => {
    const id = req.params.id;

    Booking.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Booking was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Booking with id=${id}. Maybe Booking was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Booking with id=" + id
            });
        });
};

// // Delete all Bookings from the database.
// exports.deleteAllBookings = (req, res) => {
//     Booking.destroy({
//         where: {},
//         truncate: false
//     })
//         .then(nums => {
//             res.send({ message: `${nums} Bookings were deleted successfully!` });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all Bookings."
//             });
//         });
// };


