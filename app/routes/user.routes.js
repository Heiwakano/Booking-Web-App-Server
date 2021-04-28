const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/user/:username",
    [authJwt.verifyToken],
    controller.userFindByUsername
  );
  
  app.put(
    "/api/test/user/otp/:email", controller.updateOTP
  );

  app.put(
    "/api/test/user/:id", controller.updateEmployeeName
  );


  app.put(
    "/api/test/checkotp/:email", controller.checkOTPUser
  );

  app.put(
    "/api/test/resetpassword/:email", controller.resetPassword
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

};