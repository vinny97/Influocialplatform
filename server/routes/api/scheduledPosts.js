let express = require("express");
let router = require("express").Router();
let { BadRequestResponse, OkResponse } = require("express-http-response");
const auth = require("../auth");
const cron = require("node-cron");
const axios = require("axios").default;
const ScheduledPosts = require("../../models/ScheduledPosts");
const User = require("../../models/User");
const file_url = require("../../config/").file_url;
const { sendNotification } = require("../../utilities/notification");
let Collaboration = require("../../models/Collaboration")
const mongoose = require("mongoose");
let Proposal = mongoose.model("Proposal");
//get scheduled posts
router.post(
  "/get/all",
  auth.required,

  async function (req, res, next) {
    ScheduledPosts.find({})
      .then((result) => {
        if (result) {
          next(new OkResponse({ result: result }));
        }
      })
      .catch((err) => {
        return next(new BadRequestResponse(err));
      });
  },
);

var today = new Date();
var date = `${today.getFullYear().toString().padStart(4, "0")}-${(
  today.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

//schedule a post
router.post("/post", auth.required, auth.user, async function (req, res, next) {
  console.log("inside body");
  if (req.body.scheduledPost === null || req.body.scheduledPost === undefined) {
    next(new BadRequestResponse("Missing Required parameter", 422));
  }
  console.log(req.user._id);
  //getting the date only from "postTime" field to check if the user has scheduled more posts than 25 within 24 hours
  var scheduledDayAndTime = new Date(req.body.scheduledPost.postTime);
  var scheduledDay = `${scheduledDayAndTime
    .getFullYear()
    .toString()
    .padStart(4, "0")}-${(scheduledDayAndTime.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${scheduledDayAndTime
        .getDate()
        .toString()
        .padStart(2, "0")}`;
  console.log(scheduledDay);
  const scheduledPosts = await ScheduledPosts.countDocuments({
    scheduledBy: req.user._id,
    postTime: {
      $gte: new Date(new Date(scheduledDay)),
      $lt: new Date(new Date(scheduledDay).setHours(23, 59, 59)),
    },
  });
  console.log("Count", scheduledPosts);
  if (scheduledPosts >= 25) {
    return next(
      new BadRequestResponse(
        `You have already scheduled ${scheduledPosts} posts for ${scheduledDay}, which is the maximum limit for a day`,
      ),
    );
  }

  let scheduledPost = new ScheduledPosts();
  scheduledPost.caption = req.body.scheduledPost.caption;
  scheduledPost.image = req.body.scheduledPost.image;
  scheduledPost.proposal = req.body.scheduledPost.proposal;
  // scheduledPost.imageBase64 = req.body.scheduledPost.imageBase64;
  scheduledPost.postTime = req.body.scheduledPost.postTime;
  scheduledPost.campaign = req.body.scheduledPost.campaign;
  scheduledPost.scheduledBy = req.user._id;
  scheduledPost = await scheduledPost
    .save()
    .then((scheduledPost) => {
      if (scheduledPost) {
        return next(
          new OkResponse({ scheduledPost: scheduledPost.scheduledpost() }),
        );
      } else {
        return next(new BadRequestResponse("Unable to save"));
      }
    })
    .catch((err) => {
      return next(new BadRequestResponse(err));
    });
});

cron.schedule("*/20 * * * * *", async () => {
  //get posts set to schedueld for today

  const docsCount = await ScheduledPosts.countDocuments({
    isPosted: false,
    postTime: {
      $gte: new Date(new Date(date)),
      $lt: new Date(new Date(date).setHours(23, 59, 59)),
    },
  });
  console.log("Docs", docsCount);
  if (docsCount > 0) {
    let scheduledPosts = await ScheduledPosts.find({
      isPosted: false,
    });
    //sort the array to bring the post with nearest time to index 0
    scheduledPosts = scheduledPosts.sort(function (a, b) {
      var dateA = new Date(a.postTime).getTime();
      var dateB = new Date(b.postTime).getTime();
      return dateA > dateB ? 1 : -1;
    });
    for (const post of scheduledPosts) {
      await new Promise((resolve) => {
        setTimeout(async () => {
          let current = new Date();
          let currentDate = current.getDate();
          let schedeuled = new Date(post.postTime);
          let schedeuledDate = schedeuled.getDate();
          if (post.isPosted == false) {
            // console.log(currentDate);
            // console.log(schedeuledDate);
            if (currentDate == schedeuledDate) {
              let currentTime = current.getTime();
              let schedeuledTime = schedeuled.getTime();
              // console.log(":::schedeuledTime::", schedeuledTime);
              // console.log(":::currentTime::", currentTime);

              let differenceInSeconds =
                30 + Math.ceil(schedeuledTime - currentTime) / 1000;
              console.log(":::differentTime::", differenceInSeconds);
              console.log(":::differentTime::", differenceInSeconds >= -30);
              console.log(":::differentTime::", differenceInSeconds <= 30);
              if (differenceInSeconds >= -30 && differenceInSeconds <= 30) {
                console.log(":::Inside post:::", post.postTime);
                const user = await User.findOne({ _id: post.scheduledBy });
                const instagram = user.instagram;
                // console.log("time to post", timeArray);
                if (instagram) {
                  // console.log("inside instagram");
                  console.log("Instagram->", instagram);
                  axios
                    .post(
                      `https://graph.facebook.com/${instagram.pageId
                      }/media?image_url=${post.image
                      }&caption=${encodeURIComponent(
                        post.caption,
                      )}&access_token=${instagram.longLiveAccessToken}`,
                    )
                    .then(function (response) {
                      if (response.status === 200) {
                        axios
                          .post(
                            `https://graph.facebook.com/${instagram.pageId}/media_publish?creation_id=${response.data.id}&access_token=${instagram.longLiveAccessToken}`,
                          )
                          .then(async function (response) {
                            await ScheduledPosts.findOneAndDelete({
                              _id: post._id,
                            });

                            sendNotification({
                              title: `Successfully published ${file_url}/${post.image}`,
                              type: 1,
                              sentTo: post.scheduledBy,
                            });

                            Collaboration.findOne({ proposal: post.proposal }, (err, response) => {
                              if (err) {
                                console.log(err);
                              }
                              console.log(response)
                              response.hasPublished = true;
                              response.publishedAt = new Date();
                              response.save((err, result) => {
                                if (err) {
                                  console.log(err)
                                }
                                console.log(result)
                              });
                            })
                            Proposal.findOne({ _id: post.proposal }, (err, response) => {
                              if (err) {
                                console.log(err)
                              }
                              response.status = 5;
                              response.save((err, result) => {
                                if (err) {
                                  console.log(err)
                                }
                                console.log(result)
                              })
                            })
                            resolve(response);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else {
                        console.log(response.data.error);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  sendNotification({
                    title: `Error: Could not publish ${file_url}/${post.image}: you might have swithced to another account or logged out`,
                    type: 1,
                    sentTo: post.scheduledBy,
                  });
                }
              }
            }
          }
        });
      });
    }
  }
});

module.exports = router;
