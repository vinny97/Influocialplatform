let router = require("express").Router();
let httpResponse = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
const { sendNotification } = require("../../utilities/notification");
const { title } = require("errorhandler");
let Brand = mongoose.model("Brand");
let Campaign = mongoose.model("Campaign");

let BadRequestResponse = httpResponse.BadRequestResponse;
let OkResponse = httpResponse.OkResponse;

router.param("brandId", function (req, res, next, id) {
  Brand.findById(id).then(function (brand) {
    if (!brand) {
      return next(new BadRequestResponse("No Brand Found"));
    }
    req.brand = brand;
    return next();
  });
});

router.post("/get", auth.required, auth.user, function (req, res, next) {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 20,
    sort: {
      createdAt: 0,
    },
  };

  let query = {
    createdBy: req.user._id,
    isDelete: false,
  };

  Brand.paginate(query, options, function (err, result) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    } else {
      next(new OkResponse({ result: result }));
    }
  });
});
router.post("/", auth.required, auth.user, function (req, res, next) {
  new Brand({
    name: req.body.brand.name,
    image: req.body.brand.image,
    createdBy: req.user._id,
  })
    .save()
    .then((brand) => {
      next(new OkResponse({ brand: brand }));
    });
});
router.post("/:brandId", auth.required, auth.user, function (req, res, next) {
  next(new OkResponse({ brand: req.brand }));
});
router.post("/:brandId", auth.required, auth.user, function (req, res, next) {
  req.brand.name = req.body.brand.name || req.brand.name;
  req.brand.image = req.body.brand.image || req.brand.image;
  req.brand.save().then((brand) => {
    next(new OkResponse({ brand: brand }));
  });
});
router.post("/:brandId", auth.required, auth.user, function (req, res, next) {
  req.brand.isDelete = true;
  req.brand.save().then((brand) => {
    next(new OkResponse());
  });
});

// ------------ campaigns -----------
router.post(
  "/:brandId/campaign",
  auth.required,
  auth.user,
  function (req, res, next) {
    console.log(req.user);
    if (req.user.role === 1) {
      req.body.campaign.status = 2;
    }
    new Campaign({
      ...req.body.campaign,
      brandId: req.params.brandId,
      createdBy: req.user._id,
    })
      .save()
      .then((campaign) => {
        sendNotification({
          title: `${req.user.firstName} has created a campaign`,
          type: 1,
          sentTo: "630e3b2a49f82e000fba7ef0",
        });
        console.log("Notification sent to 630e3b2a49f82e000fba7ef0");
        req.brand.campaigns.push(campaign._id);
        req.brand.save().then((brand) => {
          next(new OkResponse({ brand: brand }));
        });
      });
  },
);

// Changes -- sm
router.post(
  "/:brandId/get/campaign",
  auth.required,
  auth.user,
  function (req, res, next) {
    const options = {
      page: +req.query.page || 1,
      limit: +req.query.limit || 6,
      sort: {
        createdAt: 0,
      },
    };

    let query = {
      brandId: req.params.brandId,
      isDelete: false,
    };

    if (req.query) {
      if (+req.query.status) {
        query.status = +req.query.status;
      }
      if (+req.query.type && +req.query.type !== 0) {
        query.type = +req.query.type;
      }
      if (req.query.nameSearch) {
        query.name = { $regex: req.query.nameSearch, $options: "i" };
      }
    }
    
    Campaign.paginate(query, options, function (err, result) {
      if (err) {
        next(new BadRequestResponse("Server Error"));
      } else {
        next(new OkResponse({ result: result }));
      }
    });
  },
);

module.exports = router;
