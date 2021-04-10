const db = require("../models");
const Status = db.statuses;
const Op = db.Sequelize.Op;


//For test
exports.createStatus = (status) => {
  return Status.create({
      Label: status.Label,
  })
      .then((status) => {
          console.log(">> Created status: " + JSON.stringify(status, null, 4));
          return status;
      })
      .catch((err) => {
          console.log(">> Error while creating status: ", err);
      });
};


// Create and Save a new Status
exports.create = (req, res) => {
  // Validate request
  if (!req.body.Label) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Status
  const status = {
    Label: req.body.Label,
  };

  // Save Status in the database
  Status.create(status)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Status."
      });
    });
    
};

// Retrieve all Rooms from the database.
exports.findAll = (req, res) => {
    const status = req.query.Label;
    var condition = status ? { Label: { [Op.like]: `%${status}%` } } : null;
  
    Status.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving rooms."
        });
      });
  };

// Find a single Status with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Status.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Status with id=" + id
        });
      });
};

// Update a Status by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Status.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Status was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Status with id=${id}. Maybe Status was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Status with id=" + id
        });
      });
};

// Delete a Status with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Status.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Status was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Status with id=${id}. Maybe Status was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Status with id=" + id
        });
      });
};

// Delete all Rooms from the database.
exports.deleteAll = (req, res) => {
    Status.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Rooms were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all tutorials."
          });
        });
};
