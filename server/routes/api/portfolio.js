let router = require("express").Router();
let httpResponse = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
const { BadRequestResponse, OkResponse } = require("express-http-response");
let Portfolio = require("../../models/Portfolio");

router.post("/", auth.required, auth.user, async function (req, res, next) {
  console.log(req.body.portfolio);
  console.log(req.user);
  let url = req.body.portfolio.url;

  if (req.body.portfolio === null || req.body.portfolio === undefined) {
    return next(new BadRequestResponse("Missing Required Parameter"));
  }

  new Portfolio({
    ...req.body.portfolio,
    influencer: req.user._id,
  }).save((err, portfolio) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }

    return next(new next(new OkResponse(portfolio)));
  });
});

router.post("/all", auth.required, auth.user, function (req, res, next) {
  const options = {
    page: +req.query.page || 1,
    limit: +req.query.limit || 8,
    sort: {
      createdAt: -1,
    },
  };

  let query = { influencer: req.user._id };
  Portfolio.paginate(query, options, function (err, result) {
    if (err) {
      console.log(err);
      next(new BadRequestResponse("Server Error"));
    } else {
      next(new OkResponse({ result: result }));
    }
  });
});

router.post("/all/:id", auth.required, auth.user, function (req, res, next) {
  const options = {
    page: +req.query.page || 1,
    limit: +req.query.limit || 8,
    sort: {
      createdAt: -1,
    },
  };

  let query = { influencer: req.params.id };
  Portfolio.paginate(query, options, function (err, result) {
    if (err) {
      console.log(err);
      next(new BadRequestResponse("Server Error"));
    } else {
      next(new OkResponse({ result: result }));
    }
  });
});
module.exports = router;
