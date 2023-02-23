let router = require("express").Router();
let ObjectId = require("mongodb").ObjectID;
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
const { sendNotification } = require("../../utilities/notification");

let Transaction = mongoose.model("Transaction");

router.param("transactionID", function (req, res, next, id) {
  Transaction.findOne({ _id: id })
    .then(function (transaction) {
      if (!transaction) {
        return next(new BadRequestResponse("No transaction Found"));
      }
      req.transaction = transaction;
      return next();
    })
    .catch(next);
});

router.post("/create/", auth.required, auth.user, function (req, res, next) {
  const transaction = req.body.transaction;

  console.log(req);
  if (typeof transaction === "undefined" || transaction === null) {
    return next(new BadRequestResponse("Transaction is required"));
  }
  const campaign = transaction.campaign;
  if (typeof campaign === "undefined" || campaign === null) {
    return next(new BadRequestResponse("campaign is required"));
  }
  const proposal = transaction.proposal;
  if (typeof proposal === "undefined" || proposal === null) {
    return next(new BadRequestResponse("proposal is required"));
  }
  new Transaction({ ...req.body.transaction, user: req.user._id })
    .save()
    .then(function (transaction) {
      // console.log("::::transaction::::", transaction);
      next(new OkResponse({ transaction: transaction }));
    })
    .catch((err) => {
      console.log(err);
    });
});

//calll this api to change the trana\saction status
router.post(
  "/:transactionID",
  auth.required,
  auth.user,
  function (req, res, next) {
    let t = req.body.transaction;
    // console.log(t);
    if (t) {
      // console.log(t.payPalData);
      if (t.status) req.transaction.status = t.status;
      if (t.payPalData) req.transaction.payPalData = t.payPalData;

      // console.log(req.transaction.payPalData);
    }

    req.transaction.save((err, transaction) => {
      console.log(":::::Transaction::::::::::", transaction);
      console.log(":::::Transaction::::::::::", transaction.firstName);
      if (err) return next(new BadRequestResponse(err));
      next(new OkResponse({ transaction: transaction }));
    });
  },
);

router.post(
  "/get/all",
  auth.required,
  auth.admin,
  async function (req, res, next) {
    const options = {
      page: +req.query.page || 1,
      limit: +req.query.limit || 8,
      sort: {
        createdAt: -1,
      },
    };

    let query = {};

    if (req.query.status) query.status = +req.query.status;

    Transaction.paginate(query, options, function (err, result) {
      if (err) {
        next(new BadRequestResponse("Server Error"));
      } else {
        next(new OkResponse({ result: result }));
      }
    });
  },
);
router.post(
  "/:transactionID",
  auth.required,
  auth.user,
  function (req, res, next) {
    Promise.all([req.transaction])
      .then(function (results) {
        next(new OkResponse({ transaction: req.transaction }));
      })
      .catch(next);
  },
);

module.exports = router;
