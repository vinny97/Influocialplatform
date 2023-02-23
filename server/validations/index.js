let {
  OkResponse,
  BadRequestResponse,
  InternalServerErrorResponse,
} = require("express-http-response");

const { validationResult } = require("express-validator");
let mongoose = require("mongoose");
let User = mongoose.model("User");
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new BadRequestResponse("Missing required parameter.", 422.0, req.body));
  } else {
    next();
  }
};
const isUpdateEmailExist = (req, res, next) => {
  if (req.user && req.user.email !== req.body.user.email) {
    User.count({ $and: [{ email: req.body.user.email }] }, (err, count) => {
      if (err) {
        next(new InternalServerErrorResponse());
      } else if (count > 0) {
        next(new BadRequestResponse("E-mail already exist.", 422.1));
      } else {
        next();
      }
    });
  } else {
    next();
  }
};
const isEmailExist = (req, res, next) => {
  User.count({ $and: [{ email: req.body.user.email }] }, (err, count) => {
    if (err) {
      next(new InternalServerErrorResponse());
    } else if (count > 0) {
      next(new BadRequestResponse("E-mail already exist.", 422.1));
    } else {
      next();
    }
  });
};
const isUserExist = (req, res, next) => {
  if (!req.body.scheduledPost.userId) {
    console.log("inside");
    return next(new BadRequestResponse("User Id not provided in body"));
  } else {
    User.findOne({ _id: req.body.scheduledPost.userId })
      .then((user) => {
        if (user) {
          console.log("user found");
          next();
        } else {
          next(new BadRequestResponse("User does not exist"));
        }
      })
      .catch((err) => {
        console.log(err);
        next(new BadRequestResponse("The provided Id is not valid"));
      });
  }
};

module.exports = { validate, isEmailExist, isUserExist, isUpdateEmailExist };
