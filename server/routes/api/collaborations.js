const express = require("express");
const router = express.Router();
let Collaboration = require("../../models/Collaboration");
const auth = require("../auth");
let { BadRequestResponse, OkResponse } = require("express-http-response");
const mongoose = require("mongoose");
const axios = require("axios").default;
const User = require("../../models/User");
router.post("/:brand", auth.required, async function (req, res, next) {
    console.log(req.params.brand)
    Collaboration.find({ brand: req.params.brand })
        .populate({
            path: "influencer",
            model: "User",

        })
        .exec(async (err, response) => {
            if (err) {
                return next(new BadRequestResponse(err));
            }
            console.log(response)
            if (response.length > 0) {
                for (const collab of response) {
                    console.log(":::::::Collab::::", collab)
                    if (collab.influencer.instagram) {
                        await new Promise((resolve, reject) => {
                            axios
                                .get(
                                    `https://graph.facebook.com/v3.2/${collab.influencer.instagram.pageId}?fields=biography,id,username,follows_count,followers_count,media_count,media{comments_count,like_count},profile_picture_url,website&access_token=${collab.influencer.instagram.longLiveAccessToken}`
                                )
                                .then((result) => {
                                    collab.influencer.instagram = { ...null };
                                    let instagramInfo = { ...collab._doc, instagramInfo: result.data };
                                    let likes = result.data.media.data
                                    let totalLikes = 0;
                                    if (likes.length > 0) {
                                        totalLikes = likes.reduce((a, b) => a + b.like_count, 0);

                                    }
                                    instagramInfo.instagramInfo.totalLikes = totalLikes;


                                    const index = response.indexOf(collab);
                                    response[index] = instagramInfo
                                    resolve(result);
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        });
                    }

                    return next(new OkResponse({ result: response }));
                }
            } else {
                return next(new OkResponse({ result: response }));
            }
        });
});

router.post("/", auth.required, async (req, res, next) => {
    let collaboration = req.body.collaboration;

    Collaboration.findOne({ _id: collaboration._id }, function (err, result) {
        if (err) {
            return next(new BadRequestResponse(err));
        }
        result.hasRated = true;
        result.rating = collaboration.rating;
        result.save((err, result) => {
            if (err) {
                return next(new BadRequestResponse(err));
            }
            // return next(new OkResponse({ result: result }));
            Collaboration.find({ influencer: collaboration.influencer }, (err, response) => {
                if (err) {
                    return next(new BadRequestResponse(err));
                }
                User.findOne({ _id: collaboration.influencer }, (err, user) => {
                    if (err) {
                        return next(new BadRequestResponse(err));
                    }
                    console.log('average:::::', response);

                    if (response.length > 0) {
                        let allDocuments = [];
                        allDocuments = response.map(doc => doc.rating);
                        console.log('allDocuments:::::', allDocuments);
                        console.log('average:::::', average);
                        console.log(typeof (average))
                        user.rating = +average;
                    }
                    user.save((err, user) => {
                        if (err) {
                            return next(new BadRequestResponse(err));
                        }
                        return next(new OkResponse({ result: result }));
                    })
                })
            })
        })
    });
})


router.post("/rating/:influencerID", auth.required, async (req, res, next) => {
    Collaboration.find({ proposal: req.params.influencerID }, { rating: 1 }, (err, response) => {
        if (err) {
            return next(new BadRequestResponse(err));
        }
        return next(new OkResponse({ result: response }));
    })

})
module.exports = router;
