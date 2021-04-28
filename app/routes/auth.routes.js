const { verifySignUp } = require("../middleware");
const { modelBinding } = require("../middleware");
const controller = require("../controllers/auth.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      modelBinding.checkFirstname,
      modelBinding.checkLastname,
      modelBinding.checkUsername,
      modelBinding.checkEmail,
      modelBinding.checkPassword,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin",
    [
      modelBinding.checkUsername,
      modelBinding.checkPassword,
    ],

    controller.signin);
};