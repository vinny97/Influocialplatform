let router = require("express").Router();
let httpResponse = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
const { sendNotification } = require("../../utilities/notification");
const { ADMIN_ACTIONS } = require("../../constants/admin-actions");
let Campaign = mongoose.model("Campaign");
let Proposal = mongoose.model("Proposal");
let Collaboration = require("../../models/Collaboration");

let BadRequestResponse = httpResponse.BadRequestResponse;
let OkResponse = httpResponse.OkResponse;

router.param("campaignID", function (req, res, next, id) {
  Campaign.findById(id).then(function (campaign) {
    if (!campaign) {
      return next(new BadRequestResponse("No campaign Found"));
    }
    req.campaign = campaign;
    return next();
  });
});

router.post("/all", auth.required, auth.user, function (req, res, next) {
  const options = {
    page: +req.query.page || 1,
    limit: +req.query.limit || 6,
    sort: {
      createdAt: -1,
    },
    populate: "createdBy",
  };

  let query = { status: 2 };
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

    if (+req.query.category) {
      query.category = +req.query.category;
    }
    console.log(req.query.isFavorite);
    if (+req.query.isFavorite === 1) {
      console.log("inside");
      query.isFavorite = +req.query.isFavorite;
    }
  }
  console.log("==> ", query);

  Campaign.paginate(query, options, function (err, result) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    } else {
      console.log(result);
      next(new OkResponse({ result: result }));
    }
  });
});

// return Campaign's Data
router.post("/:campaignID", auth.required, auth.user, function (req, res, next) {
  Promise.all([req.campaign.populate("proposals").execPopulate()])
    .then(function (results) {
      next(new OkResponse({ campaign: req.campaign }));
    })
    .catch(next);
});

// Creates New Proposal
router.post(
  "/:campaignID/proposal",
  auth.required,
  auth.user,
  function (req, res, next) {
    console.log(":::proposalbody", req.body);
    console.log(":::UserId", req.user);
    console.log(":::req:::::::::::::::::::::::::::::::::::", req.campaign);
    new Proposal({
      ...req.body.proposal,
      influencer: req.user._id,
      campaign: req.campaign._id,
      proposalType: req.campaign.type,
      createdBy: req.user._id,
    })
      .save()
      .then((proposal) => {
        console.log("proposal", proposal);
        let collaboration = new Collaboration();
        collaboration.proposal = proposal._id;
        collaboration.campaign = req.campaign._id;
        collaboration.influencer = proposal.influencer;
        collaboration.brand = req.campaign.createdBy;
        collaboration.proposalSubmittion = new Date();
        collaboration.save((err, response) => {
          if (err) {
            console.log("error", err);
          }
          console.log("interaction", response);
        })
        if (req.user._id !== req.campaign.createdBy) {
          sendNotification({
            title: `${req.user.firstName} has applied on your campaign ${req.campaign.name}`,
            type: 2,
            sentTo: req.campaign.createdBy,
          });
        }
        req.campaign.proposals.push(proposal._id);
        req.campaign.save().then((campaign) => {
          next(new OkResponse({ proposal: proposal }));
        });
      });
  },
);

// Update Campaign's Data
// Changes - sm
router.post(
  "/update/:campaignID",

  async function (req, res, next) {
    let camp = req.body.campaign;
    // console.log("campaign::::", camp);
    // console.log("campaign created by::::", req.campaign._id);
    // console.log("campaigny::::", req.campaign);
    // console.log("campaign::::", req.user);
    console.log("campaign Stats::::", req.user);

    if (camp && camp.status) {
      req.campaign.status = camp.status;
      const message = ADMIN_ACTIONS.filter((result) => {
        if (result.status === camp.status) {
          return result;
        }
      });
      sendNotification({
        title: message[0].message,
        type: 3,
        sentTo: req.campaign.createdBy,
      });
    }

    if (camp && camp.rejectMessage != null) {
      req.campaign.rejectMessage = camp.rejectMessage;
    }
    if (camp && camp.isFavorite != null) {
      req.campaign.isFavorite = camp.isFavorite;
    }

    req.campaign
      .save()
      .then(function (camp) {
        next(new OkResponse({ campaign: camp }));
      })
      .catch(next);
  },
);

module.exports = router;
