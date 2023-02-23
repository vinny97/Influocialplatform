const { check } = require("express-validator");

let {
  InternalServerErrorResponse,
  BadRequestResponse,
} = require("express-http-response");

const registerEmail = [
  check("user.firstName").not().isEmpty(),
  check("user.lastName").not().isEmpty(),
  check("user.email").not().isEmpty().isEmail(),
  check("user.password").not().isEmpty(),
];
const loginEmail = [
  check("user.email").not().isEmpty().isEmail(),
  check("user.password").not().isEmpty(),
];

const verifyEmail = [
  check("user.email").not().isEmpty(),
  check("user.otp").not().isEmpty(),
];

const createAdmin = [
  check("user.firstName").not().isEmpty(),
  check("user.email").not().isEmpty().isEmail(),
];

const caption = [
  check("caption")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("caption Can't be empty!")
    .bail(),
];
module.exports = {
  registerEmail,
  loginEmail,
  caption,
  verifyEmail,
  createAdmin,
};
