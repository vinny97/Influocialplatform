const InstagramWebApi = require("instagram-web-api");
let express = require("express");
let router = require("express").Router();
const auth = require("../auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Instagram = mongoose.model("Instagram");
const passportInstagram = require("../../utilities/passport-instagram");
//Schema
let User = mongoose.model("User");
const { BadRequestResponse, OkResponse } = require("express-http-response");

//for body
const clientForBody = async function (req, res, next) {
  if (req.body.instagram) {
    req.client = new InstagramWebApi({
      username: req.body.instagram.username,
      password: req.body.instagram.password,
    });
    next();
  }
};
//for params
const clientForParams = async function (req, res, next) {
  if (!req.params.userID) {
    next(new BadRequestResponse("UserId missing in params", 422));
  } else {
    await Instagram.findOne(
      { user: req.params.userID },
      async function (err, user) {
        if (err) {
          console.log(err);
          return next(new BadRequestResponse("Server Error..."));
        }
        if (user) {
          console.log(":::user:::", user);
          req.user = user;
          req.client = new InstagramWebApi({
            username: user.username,
            password: user.password,
          });
        }
      },
    );
    next();
  }
};

//instagram login and storing instagram information in DB
router.post("/login/:userID", clientForBody, async function (req, res, next) {
  console.log(req.body.instagram);
  if (!req.body.instagram.username || !req.body.instagram.password) {
    next(new BadRequestResponse("Missing Required Paramaters", 422));
  }

  const login = await req.client.login();

  console.log(login);
  console.log(login.userId);
  if (!login.user) {
    next(new BadRequestResponse("User does not exist", 401));
  } else if (!login.authenticated) {
    next(new BadRequestResponse("Wrong username of password", 401));
  } else if (login.authenticated) {
    //save user information
    const isUserExist = await Instagram.findOneAndUpdate(
      { user: req.params.userID },
      { loginStatus: 1 },
    );
    if (isUserExist) {
      return next(
        new OkResponse({ instagram: isUserExist.toInstagramAuthJson() }),
      );
    } else {
      const profile = await req.client.getProfile();
      console.log(":::profile::", profile);
      console.log(":::profile::", login.userId);
      const followers = await req.client.getFollowers({
        userId: login.userId,
      });
      console.log(":::followers::", followers);

      const photos = await req.client.getPhotosByUsername({
        username: profile.username,
      });
      console.log(":::photos::", photos);

      if (profile) {
        const user = new Instagram();
        user.user = req.params.userID;
        user.isAutoLogin = req.body.instagram.isAutoLogin;
        user.username = req.body.instagram.username;
        user.password = req.body.instagram.password;
        user.instagramData.push({ profile: profile });
        user.instagramData.push({ followers: followers });
        user.instagramData.push({ photos: photos });
        user.loginStatus = 1;
        user.save((err, user) => {
          if (err) {
            console.log(err);
            return next(new BadRequestResponse("Server Error"));
          }
          return next(
            new OkResponse({ instagram: user.toInstagramAuthJson() }),
          );
        });
      } else {
        return next(new BadRequestResponse("Instagram server error"));
      }
    }
  }
});

router.get("/currentInstagramUser/:userID", function (req, res, next) {
  console.log("::::id::::", req.params.userID);
  Instagram.findOne({ user: req.params.userID }, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (user) {
      return next(
        new OkResponse({
          instagram: user.toInstagramAuthJson(),
        }),
      );
    } else {
      return next(new BadRequestResponse("Server Error"));
    }
  });
});

//instagram login after user login
router.get(
  "/setInstagramAuth/:userID",
  clientForParams,
  async function (req, res, next) {
    const login = await req.client.login();
    console.log(login);
    if (!login.user) {
      next(new BadRequestResponse("User does not exist", 401));
    } else if (!login.authenticated) {
      next(new BadRequestResponse("Wrong username of password", 401));
    } else if (login.authenticated) {
      return next(
        await Instagram.findOneAndUpdate(
          { user: req.params.userID },
          { loginStatus: 1 },
        ).then((err, updatedUser) => {
          if (err) {
            console.log(err);
            return next(new BadRequestResponse("Server Error"));
          }
          if (updatedUser) {
            next(
              new OkResponse({ instagram: updatedUser.toInstagramAuthJson() }),
            );
          }
        }),
      );
    }
  },
);

router.get(
  "/purgeInstagramAuth/:userID",
  clientForParams,
  async function (req, res, next) {
    const logout = await req.client.logout();
    console.log(logout);
  },
);

router.get("/getProfileInfo/:userID", async function (req, res, next) {
  if (!req.params.userID) {
    next(new BadRequestResponse("UserId missing in params", 422));
  } else {
    const user = await Instagram.findOne({ user: req.params.userID });
    if (!user) {
      return next(new BadRequestResponse("No data found against this user"));
    }
    if (user) {
      return next(new OkResponse({ instagram: user.toInstagramAuthJson() }));
    }
  }
});

router.get("/getprof/:userID", async function (req, res, next) {
  const client = new InstagramWebApi({
    username: req.body.instagram.username,
    password: req.body.instagram.password,
  });

  const instagram = await client.getUserByUsername({
    username: "umarqayyumofficial",
  });

  console.log(instagram);
});
module.exports = router;
//  if (login.authenticated) {
//    return next(
//      await Instagram.findByIdAndUpdate(
//        { user: req.params.userID },
//        { loginStatus: 1 },
//      ).then((err, updatedUser) => {
//        if (err) {
//          console.log(err);
//          return next(new BadRequestResponse("Server Error"));
//        }
//        if (updatedUser) {
//          next(new OkResponse({ instagram: updatedUser.toInstagramAuthJson() }));
//        }
//      }),
//    );
//  }
