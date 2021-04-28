const { body, check, validationResult } = require('express-validator');
checkFirstname = async (req, res, next) => {
    await check('firstname')
    .notEmpty()
    .withMessage('must contain a firstname')
    .matches(/^[a-zA-Z ]*$/)
    .withMessage('first name must be a english character')
    .run(req);

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
};
checkLastname = async (req, res, next) => {
    await check('lastname')
    .notEmpty()
    .withMessage('must contain a lastname')
    .matches(/^[a-zA-Z ]*$/)
    .withMessage('last name must be a english character')
    .run(req);

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
};
checkUsername = async (req, res, next) => {
    await check('username')
    .notEmpty()
    .withMessage('must contain a username')
    .isLength({ max: 20 })
    .withMessage('username must be at not more than 20 chars long')
    .isLength({ min: 3 })
    .withMessage('username must be at least 3 chars long')
    .run(req);

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
};
checkEmail = async (req, res, next) => {
    await check('email')
    .notEmpty()
    .withMessage('must contain a email')
    .isEmail()
    .withMessage('not an email')
    .run(req);

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
};
checkPassword = async (req, res, next) => {
    await check('password')
    .notEmpty()
    .withMessage('must contain a password')
    .isLength({ max: 40 })
    .withMessage('password must be at not more than 40 chars long')
    .isLength({ min: 1 })
    .withMessage('password must be at least 1 chars long')
    .run(req);

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
};
const modelBinding = {
    checkFirstname: checkFirstname,
    checkLastname: checkLastname,
    checkUsername: checkUsername,
    checkEmail: checkEmail,
    checkPassword: checkPassword,
}
module.exports = modelBinding;