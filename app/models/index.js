const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.bookings = require("./booking.model.js")(sequelize, Sequelize);
db.rooms = require("./room.model.js")(sequelize, Sequelize);
db.statuses = require("./status.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];


db.bookings.belongsTo(db.rooms, {
  foreignKey: "roomId",
  as: "room",
});
db.rooms.hasMany(db.bookings, { as: "bookings"});

db.statuses.hasMany(db.bookings, { as: "bookings"});
db.bookings.belongsTo(db.statuses, {
  foreignKey: "statusId",
  as: "status",
});

module.exports = db;