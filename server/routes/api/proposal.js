let router = require("express").Router();
let httpResponse = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");

const { sendNotification } = require("../../utilities/notification");
// const { query } = require("express-validator");
let Proposal = mongoose.model("Proposal");
let Campaign = mongoose.model("Campaign");
let User = mongoose.model("User");

let BadRequestResponse = httpResponse.BadRequestResponse;
let OkResponse = httpResponse.OkResponse;
let Collaboration = require("../../models/Collaboration")
router.param("proposalID", function (req, res, next, id) {
  console.log("::::ID::::", id);
  Proposal.findById(id).then(function (proposal) {
    if (!proposal) {
      return next(new BadRequestResponse("No proposal Found"));
    }
    req.proposal = proposal;
    return next();
  });
});

// Proposals By Influencer
router.post(
  "/influencer/all",
  auth.required,
  auth.user,
  async function (req, res, next) {
    const options = {
      page: +req.query.page || 1,
      limit: +req.query.limit || 6,
      populate: [
        {
          path: "campaign",
          model: "Campaign",
          select: "_id image firstName lastName",
        },
      ],
      sort: {
        createdAt: -1,
      },
    };

    // Find Campaign ids that match type
    let campaigns = await Campaign.find({
      type: +req.query.campaignType,
    }).distinct("_id");

    let query = {
      influencer: req.user._id,
      campaign: { $in: campaigns },
    };

    if (req.query) {
      if (+req.query.status) {
        query.status = +req.query.status;
      }

      if (+req.query.outrightStatus && +req.query.outrightStatus !== 0) {
        query.outrightStatus = +req.query.outrightStatus;
      }
    }

    // log("====>", query, options)

    Proposal.paginate(query, options, function (err, result) {
      if (err) {
        console.log(err);
        next(new BadRequestResponse("Server Error"));
      } else {
        next(new OkResponse({ result: result }));
      }
    });
  },
);

router.post("/all", auth.required, auth.user, function (req, res, next) {
  const options = {
    page: +req.query.page || 1,
    limit: +req.query.limit || 6,
    populate: [
      {
        path: "influencer",
        model: "User",
        select: "_id firstName lastName image instagram",
      },
    ],
    sort: {
      createdAt: -1,
    },
  };
  let query = {};

  if (req.query) {
    if (req.query.campaign) {
      query.campaign = req.query.campaign;
    }

    if (+req.query.status) {
      query.status = +req.query.status;
    }

    if (+req.query.contentStatus) {
      query.contentStatus = +req.query.contentStatus;
    }

    if (+req.query.outrightStatus && +req.query.outrightStatus !== 0) {
      query.outrightStatus = +req.query.outrightStatus;
    }

    if (+req.query.isFavorite) {
      query.isFavorite = +req.query.isFavorite;
    }
  }

  console.log(query);
  Proposal.paginate(query, options, function (err, result) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    } else {
      next(new OkResponse({ result: result }));
    }
  });
});

// return Proposal's Data
router.post("/:proposalID", auth.required, auth.user, function (req, res, next) {
  Promise.all([
    req.proposal
      .populate("influencer", "firstName lastName instagram image")
      .populate("campaign", "startDate")
      .execPopulate(),
  ])
    .then(function (results) {
      next(new OkResponse({ proposal: req.proposal }));
    })
    .catch(next);
});

// Update Proposal's Data
router.put(
  "/:proposalID",
  auth.required,
  auth.user,
  async function (req, res, next) {
    // console.log(":::REq:::", req.user);
    // console.log(req.campaign);
    var p = req.body.proposal;
    var user = req.user;
    console.log("currentUser>>>>>>>>>", user);
    const campaign = await Campaign.find({ _id: req.proposal.campaign });
    console.log("result???????????????", campaign);
    if (p && p.status) {
      req.proposal.status = p.status;
    }
    if (p && p.fee) {
      req.proposal.fee = p.fee;
    }

    if (p && p.isFavorite != null) {
      req.proposal.isFavorite = p.isFavorite;
    }
    console.log("proposal>>>>>>>>>", p);
    if (p && p.rebid) {
      console.log("rebid>>>>>>>>>>>>>>>>", p.rebid);
      console.log("Redrebid>>>>>>>>>>>>>>>>", req.proposal.rebid);

      req.proposal.rebid = p.rebid;
      console.log("Redrebid>>>>>>>>>>>>>>><<<>", req.proposal.rebid);
    }

    // Updates Content Status
    if (p && p.contentStatus) {
      req.proposal.contentStatus = p.contentStatus;

      if (p.contentStatus == 1) {
        if (req.user._id !== campaign[0].createdBy) {
        }
      }
      if (p.outrightStatus == 0 && p.contentStatus == 2) {
        sendNotification({
          title: `The content you submitted for campaign ${campaign[0].name} has been approved`,
          type: 2,
          sentTo: req.proposal.influencer,
        });
      }
      if (p.outrightStatus == 0 && p.contentStatus == 3) {
        sendNotification({
          title: `The content you submitted for campaign ${campaign[0].name} has been declined`,
          type: 2,
          sentTo: req.proposal.influencer,
        });
      }
    }
    // Content Images
    if (p && p.contentPost) {
      req.proposal.contentPost = p.contentPost;
    }

    if (p && p.contentCaption) {
      req.proposal.contentCaption = p.contentCaption;
    }

    // Outright Status
    if (p && p.outrightStatus) {
      req.proposal.outrightStatus = p.outrightStatus;
      console.log(":::::::OUTRIGHT status::::::::", p.outrightStatus);
      if (p.outrightStatus == 1) {
        sendNotification({
          title: `${req.user.firstName} wants to outright your content ${req.proposal.motivation}, Say your bid!`,
          type: 2,
          sentTo: req.proposal.influencer,
        });
      }
      console.log("::::Body:::", req.body.proposal);
      if (p.outrightStatus == 2) {
        sendNotification({
          title: `${req.user.firstName} has accepted your outright request for $${req.body.proposal.outrightFee}`,
          type: 2,
          sentTo: campaign[0].createdBy,
        });
      }
      if (p.outrightStatus == 3) {
        sendNotification({
          title: `Congratulations ${req.user.firstName} has approved your bid of $${req.proposal.outrightFee} you submitted for ${req.proposal.motivation}`,
          type: 2,
          sentTo: req.proposal.influencer,
        });
      }
      if (p.outrightStatus == 4) {
        sendNotification({
          title: `${req.user.firstName} has declined your bid of $${req.proposal.outrightFee} you submitted for ${req.proposal.motivation}`,
          type: 2,
          sentTo: req.proposal.influencer,
        });
      }
    }

    // OutRight Fee
    if (p && p.outrightFee) {
      req.proposal.outrightFee = p.outrightFee;
    }

    // OutRight Fee
    if (p && p.contentPublishID) {
      req.proposal.contentPublishID = p.contentPublishID;
    }

    req.proposal
      .save()
      .then(async function (p) {
        console.log('p', p)
        // if post is published adds influencer to Campaign User's collaborators list for Groups
        if (p.status === 4) {
          let campaignUser = await Campaign.findOne({
            _id: req.proposal.campaign,
          }).select("createdBy");
          await User.updateOne(
            { _id: campaignUser.createdBy },
            { $addToSet: { collaborators: p.influencer } },
            function (err, doc) {
              if (err) {
                return new BadRequestResponse("Server Error");
              }
            },
          );

          next(new OkResponse({ proposal: p }));
          sendNotification({
            title: `${req.user.lastName} has declined your proposal for $${req.proposal.motivation}`,
            type: 2,
            sentTo: p.influencer._id,
          });
          Collaboration.findOne({ proposal: p._id }, (err, response) => {
            if (err) {
              console.log(err);
            }
            console.log(response)
            response.proposalRejected = new Date();
            response.save((err, result) => {
              if (err) {
                console.log(err)
              }
              console.log(result)
            });
          })
        }
        next(new OkResponse({ proposal: p }));
        if (p.status === 1) {
          if (p.rebid === 2) {
            sendNotification({
              title: `Rebid request you made for a proposal on the campaign ${campaign[0].name} has been accepted`,
              type: 2,
              sentTo: campaign[0].createdBy,
            });
          }
        }
        if (p.status === 2) {
          if (p.rebid === 1) {
            sendNotification({
              title: `A proposal you submitted for campaign ${campaign[0].name} needs to be rebid`,
              type: 2,
              sentTo: p.influencer._id,
            });
          }
        }

        if (p.status === 3) {
          if (p.status === 3 && p.contentStatus === 0) {
            sendNotification({
              title: `${req.user.lastName} has accepted your proposal for $${req.proposal.fee}`,
              type: 2,
              sentTo: p.influencer._id,
            });
            Collaboration.findOne({ proposal: p._id }, (err, response) => {
              if (err) {
                console.log(err);
              }
              console.log(response)
              response.proposalAccepted = new Date();
              response.save((err, result) => {
                if (err) {
                  console.log(err)
                }
                console.log(result)
              });
            })
          }

          if (p.status === 3 && p.contentStatus === 1) {
            if (req.user._id !== campaign[0].createdBy) {
              sendNotification({
                title: `${req.user.firstName} has submitted the content for ${campaign[0].name}`,
                type: 2,
                sentTo: campaign[0].createdBy,
              });

              Collaboration.findOne({ proposal: p._id }, (err, response) => {
                if (err) {
                  console.log(err);
                }
                console.log(response)
                response.contentSubmitted = new Date();
                response.save((err, result) => {
                  if (err) {
                    console.log(err)
                  }
                  console.log(result)
                });
              })
            }
          }
          if (p.status === 3 && p.contentStatus === 2) {
            sendNotification({
              title: `The content you submitted for campaign ${campaign[0].name} has been approved`,
              type: 2,
              sentTo: req.proposal.influencer,
            });
            Collaboration.findOne({ proposal: p._id }, (err, response) => {
              if (err) {
                console.log(err);
              }
              console.log(response)
              response.contentApproved = new Date();
              response.save((err, result) => {
                if (err) {
                  console.log(err)
                }
                console.log(result)
              });
            })
          }
          if (p.status === 3 && p.contentStatus === 3) {
            sendNotification({
              title: `The content you submitted for campaign ${campaign[0].name} has been declined`,
              type: 2,
              sentTo: req.proposal.influencer,
            });
            Collaboration.findOne({ proposal: p._id }, (err, response) => {
              if (err) {
                console.log(err);
              }
              console.log(response)
              response.contentDeclined = new Date();
              response.save((err, result) => {
                if (err) {
                  console.log(err)
                }
                console.log(result)
              });
            })
          }
          if (p.status === 3 || p.status === 5) {
            if (p.contentStatus !== 0 || p.contentStatus !== 3) {
              if (p.outrightStatus === 1) {
                sendNotification({
                  title: `${req.user.firstName} wants to outright your content ${req.proposal.motivation}, Say your bid!`,
                  type: 2,
                  sentTo: req.proposal.influencer,
                });
                Collaboration.findOne({ proposal: p._id }, (err, response) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(response)
                  response.outrightRequested = new Date();
                  response.save((err, result) => {
                    if (err) {
                      console.log(err)
                    }
                    console.log(result)
                  });
                })
              }
              if (p.outrightStatus === 2) {
                sendNotification({
                  title: `${req.user.firstName} has accepted your outright request for $${req.proposal.outrightFee}`,
                  type: 2,
                  sentTo: campaign[0].createdBy,
                });
                Collaboration.findOne({ proposal: p._id }, (err, response) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(response)
                  response.outrightRequestAccepted = new Date();
                  response.save((err, result) => {
                    if (err) {
                      console.log(err)
                    }
                    console.log(result)
                  });
                })
              }
              if (p.outrightStatus === 3) {
                sendNotification({
                  title: `${req.user.firstName} has approved the outright bid of $${req.proposal.outrightFee}`,
                  type: 2,
                  sentTo: req.proposal.influencer,
                });
                Collaboration.findOne({ proposal: p._id }, (err, response) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(response)
                  response.outrightBidApproved = new Date();
                  response.save((err, result) => {
                    if (err) {
                      console.log(err)
                    }
                    console.log(result)
                  });
                })
              }
              if (p.outrightStatus === 4) {
                sendNotification({
                  title: `${req.user.firstName} has declined your bid of $${req.proposal.outrightFee} you submitted for ${req.proposal.motivation}`,
                  type: 2,
                  sentTo: req.proposal.influencer,
                });
                Collaboration.findOne({ proposal: p._id }, (err, response) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(response)
                  response.outrightBidRejected = new Date();
                  response.save((err, result) => {
                    if (err) {
                      console.log(err)
                    }
                    console.log(result)
                  });
                })
              }
            }
          }
          if (p.status === 5 && p.contentStatus === 4) {
            Collaboration.findOne({ proposal: p._id }, (err, response) => {
              if (err) {
                console.log(err);
              }
              console.log(response)
              response.hasPosted = true;
              response.save((err, result) => {
                if (err) {
                  console.log(err)
                }
                console.log(result)
              });
            })
          }
        }
      })
      .catch(next);
  },
);

module.exports = router;
