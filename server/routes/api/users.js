let mongoose = require("mongoose");
let router = require("express").Router();
let passport = require("passport");
let User = mongoose.model("User");
const InstagramWebApi = require("instagram-web-api");
let auth = require("../auth");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const { registerEmail, loginEmail } = require("../../validations/users");
const {
  validate,
  isEmailExist,

  isUpdateEmailExist,
} = require("../../validations");
const {
  sendEmailVerificationOTP,
  sendEmailVerificationSuccess,
  sendEmailOTP,
  sendEmailForgotPasswordSuccess,
} = require("../../utilities/emailService");

const { sendNotification } = require("../../utilities/notification");
let faker = require("faker");

const client = async function (req, res, next) {
  if (req.body.instagram) {
    req.client = new InstagramWebApi({
      username: req.body.instagram.username,
      password: req.body.instagram.password,
    });
    next();
  }
};

router.get("/users", function (req, res, next) {
  User.find()
    .then(function (users) {
      if (!users) {
        return res.sendStatus(401);
      }
      return res.json({ users: users });
    })
    .catch(next);
});
router.get("/users/find/:userID", async function (req, res, next) {
  if (!req.params.userID) {
    return next(new UnauthorizedResponse("User Id is null!"));
  } else {
    const user = await User.findOne({ _id: req.params.userID });
    if (user) {
      return next(new OkResponse({ user: user.toAuthJSON() }));
    }
    if (!user) {
      return next(new BadRequestResponse("No User found against this User ID"));
    }
  }
});
router.post(
  "/user/context",
  auth.required,
  auth.user,
  function (req, res, next) {
    let user = req.user;
    user.isOnline = true;
    user.save().then(function () {
      console.log("Just logging in");
      // let other know that am online
      next(new OkResponse({ user: user.toAuthJSON() }));
    });
  },
);

router.post(
  "/user/profile",
  auth.required,
  auth.user,
  function (req, res, next) {
    let user = req.user;

    next(new OkResponse({ user: user }));
  },
);

// router.get(
//   "/user/friends",
//   auth.required,
//   auth.user,
//   function (req, res, next) {
//     User.find({ _id: { $in: req.user.friends } }, (err, friends) => {
//       next(new OkResponse({ friends: friends }));
//     }).catch((e) => {
//       next(new BadRequestResponse(`Server Error`, 500));
//     });
//   }
// );

router.post("/users/login", loginEmail, validate, function (req, res, next) {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        next(new BadRequestResponse(err.message));
      }

      if (user && !user.isEmailVerified) {
        next(new UnauthorizedResponse("Your email is not verified", 403));
      } else if (user && user.status === 2) {
        return next(
          new UnauthorizedResponse(
            "Your Account is Blocked!, Contact to Support please",
            401.1,
          ),
        );
      }
      if (user) {
        next(new OkResponse({ user: user.toAuthJSON() }));
        console.log(user.toAuthJSON());
      } else {
        next(new UnauthorizedResponse());
      }
    },
  )(req, res, next);
});

router.post(
  "/users/register",
  registerEmail,
  validate,
  isEmailExist,

  async function (req, res, next) {
    let user = new User();
    user.email = req.body.user.email;
    user.firstName = req.body.user.firstName;
    user.lastName = req.body.user.lastName;
    user.role = req.body.user.role;
    user.setPassword(req.body.user.password);
    user.setOTP();
    user
      .save()
      .then(function () {
        sendEmailOTP({
          email: user.email,
          fullName: user.fullName(),
          otp: user.otp,
        });
        next(new OkResponse({ user: user.toAuthJSON(), otp: user.otp }));
      })
      .catch(next);
  },
);


// Change user password
router.post(
  "/users/reset/cred",
  auth.required,
  auth.user,

  async function (req, res, next) {
    let user = req.user;
    user.setPassword(req.body.user.password);
    user
      .save()
      .then(function () {
        next(new OkResponse({ user: user.toAuthJSON(), status: "Success" }));
      })
      .catch(next);
  },
);

// Change password ends


router.post("/users/verify", function (req, res, next) {
  let query = {
    otp: req.body.user.otp,
    otpExpires: { $gt: Date.now() },
  };
  query.email = req.body.user.email;
  User.findOne(query, function (err, user) {
    if (err || !user) {
      next(new UnauthorizedResponse(`OTP is invalid`, 401.1));
    } else {
      if (req.body.user.type === 1) {
        user.isEmailVerified = true;
      }
      user.otp = null;
      user.otpExpires = null;

      user.save().then(function () {
        sendEmailVerificationSuccess({
          email: user.email,
          fullName: user.fullName(),
        });
        next(new OkResponse({ user: user.toAuthJSON() }));
      });
    }
  });
});

router.post("/users/verify/resend", function (req, res, next) {
  // if (req.body.user.email == "support@influocial.co.uk") {
  //   throw new BadRequestResponse("Cannot reset Admin", 400);
  // }
  let query = {};
  query.email = req.body.user.email;
  User.findOne(query, function (err, user) {
    if (err || !user) {
      next(new UnauthorizedResponse(`Email is invalid`, 401.1));
    } else {
      user.setOTP();
      sendEmailOTP({
        email: user.email,
        fullName: user.fullName(),
        otp: user.otp,
      });
      user
        .save()
        .then(function () {
          next(new OkResponse({ OTP: user.otp }));
        })
        .catch((e) => {});
    }
  });
});

router.post("/users/reset/password", function (req, res, next) {
  // check the otp and otp expiry
  // update the password
  // send the notification , email notification  if he have

  if (!(req.body.user && req.body.user.type)) {
    next(new BadRequestResponse("Missing required parameter.", 422.0, req.body));
  }

  let query = { email: req.body.user.sentTo };
  User.findOne(query, function (err, user) {
    if (err || !user) {
      next(new UnauthorizedResponse(`Email is invalid`, 401.1));
    } else {
      user.setPassword(req.body.user.password);

      sendEmailForgotPasswordSuccess({
        email: user.email,
        fullName: user.fullName(),
      });

      user
        .save()
        .then(function () {
          next(new OkResponse({}));
        })
        .catch((e) => console.log(e));
    }
  });
  next(new OkResponse({}));
});

//update instagram credentials without auth
router.put("/users/instagram/:userID", function (req, res, next) {
  console.log(req.body.instagram);
  User.findByIdAndUpdate(
    { _id: req.params.userID },
    { instagram: req.body.instagram },
    function (err, user) {
      if (err) {
        console.log(err);
        return next(new BadRequestResponse("Unable to update user"));
      }
      if (user) {
        return next(new OkResponse({ instagram: user.toAuthJSON() }));
      }
    },
  );
});

router.put(
  "/users/:userID",
  auth.required,
  auth.admin,
  function (req, res, next) {
    console.log(req.params.userID);
    User.findByIdAndUpdate(
      req.params.userID,
      { ...req.body.user },
      function (err, user) {
        if (err) {
          next(new BadRequestResponse(`Server Error`));
        }
        if (!user) {
          next(new BadRequestResponse(`User Not found`));
        }
        next(new OkResponse());
      },
    );
  },
);

router.post(
  "/user",
  auth.required,
  auth.user,
  isUpdateEmailExist,
  function (req, res, next) {
    let user = req.user;

    user.email = req.body.user.email || user.email;
    user.firstName = req.body.user.firstName || user.firstName;
    user.lastName = req.body.user.lasName || user.lastName;
    user.status = req.body.user.status || user.status;
    user.contact = req.body.user.contact || user.contact;
    user.image = req.body.user.image || user.image;
    user.gender = req.body.user.gender || user.gender;
    user.dob = req.body.user.dob || user.dob;
    user.address = req.body.user.address || user.address;
    user.isProfileComplete =
      req.body.user.isProfileComplete || user.isProfileComplete;
    user.role = req.body.user.role || user.role;
    user.companyName = req.body.user.companyName || user.companyName;
    user.companySize = req.body.user.companySize || user.companySize;
    user.instagram = req.body.user.instagram || user.instagram;

    user
      .save()
      .then(function () {
        next(new OkResponse({ user: user.toAuthJSON() }));
      })
      .catch(next);
  },
);

router.post(
  "/update/password",
  auth.required,
  auth.user,

  function (req, res, next) {
    let user = req.user;
    if (user.validPassword(req.body.user.oldPassword)) {
      user.setPassword(req.body.user.newPassword);
      user
        .save()
        .then(function () {
          next(new OkResponse({}));
        })
        .catch(next);
    } else {
      next(new UnauthorizedResponse(`Your Password is invalid`, 401.1));
    }
  },
);

module.exports = router;
