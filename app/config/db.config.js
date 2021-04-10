module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "CuEE652821",
    DB: "bookingdb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };