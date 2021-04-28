const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const Room = db.rooms;
const Booking = db.bookings;
const Status = require("./app/controllers/status.controller.js");
// const Room = require("./app/controllers/room.controller.js");
// const Booking = require("./app/controllers/booking.controller.js");

const run = async () => {
  //Create booked status
  const bookedStatus = await Status.createStatus({
    Label: 'Booked',
  });
  //Create CheckedIn status
  const checkedInStatus = await Status.createStatus({
    Label: 'CheckedIn',
  });
  //Create CheckedOut status
  const checkedOutStatus = await Status.createStatus({
    Label: 'CheckedOut',
  });
  //Create Canceled status
  const canceledStatus = await Status.createStatus({
    Label: 'Canceled',
  });
};
function initial(n) {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });
  for (var i = 1; i <= n; i++) {
    
    if (i > 99) {
      Room.create({
        id: i,
        RoomNumber: i.toString(),
        AdultsCapacity: i % 100 + 1,
        ChildrenCapacity: i % 100 + 1,
        Price: i % 10,
      });
    } else if (i > 9) {
      Room.create({
        id: i,
        RoomNumber: "0" + i.toString(),
        AdultsCapacity: i % 10+1,
        ChildrenCapacity: i % 10+1,
        Price: (i + 1),
      });
    } else {
      Room.create({
        id: i,
        RoomNumber: "00" + i.toString(),
        AdultsCapacity: i,
        ChildrenCapacity: i,
        Price: (i + 1) * 10,
      });
    }
   
  }
}

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Db');
//   initial(400);
//   run();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to itthikorn application." });
});

require("./app/routes/room.routes")(app);
require("./app/routes/booking.routes")(app);
require("./app/routes/status.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/email.routes')(app);
require('./app/routes/file.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
