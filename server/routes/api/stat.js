let router = require("express").Router();
let httpResponse = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
let Campaign = mongoose.model("Campaign");
let User = mongoose.model("User");
let Proposal = mongoose.model("Proposal");



let BadRequestResponse = httpResponse.BadRequestResponse;
let OkResponse = httpResponse.OkResponse;


// stats for admin
router.post('/admin', auth.required, auth.admin, async function (req, res, next) {
    try {
        let result = {
            inReviewCampaigns: 0,
            activeCampaigns: 0,
            completedCampaigns: 0,
            totalUsers: 0,
            totalInfluencer: 0,
            totalBrandsAndAgency: 0,
        }

        // Campaign Stats
        result.inReviewCampaigns = await Campaign.countDocuments({ status: 1 });
        result.activeCampaigns = await Campaign.countDocuments({ status: 2 });
        result.completedCampaigns = await Campaign.countDocuments({ status: 5 });

        // User Stats
        result.totalUsers = await User.countDocuments({ role: { $in: [2, 3, 4] } });
        result.totalInfluencer = await User.countDocuments({ role: 2 });
        result.totalBrandsAndAgency = await User.countDocuments({ role: { $in: [3, 4] } });

        next(new OkResponse({ result: result }));
    } catch (error) {
        next(new BadRequestResponse("Server Error"));
    }

});


// stats for influencer dashboard
router.post('/influencer', auth.required, auth.user, async function (req, res, next) {

    try {
        let result = {
            activeCampaigns: 0,
            activeInfluencerCampaigns: 0,
            activeShoutOutCampaigns: 0,
            totalProposals: 0,
            totalApprovedProposals: 0,
            totalPublishedProposals: 0,
        }

        // Campaign Stats
        result.activeCampaigns = await Campaign.countDocuments({ status: 2 });
        result.activeInfluencerCampaigns = await Campaign.countDocuments({ status: 2, type: 1 });
        result.activeShoutOutCampaigns = await Campaign.countDocuments({ status: 2, type: 2 });

        // Proposals Stats
        result.totalProposals = await Proposal.countDocuments({ influencer: req.user._id });
        result.totalApprovedProposals = await Proposal.countDocuments({ influencer: req.user._id, status: 2 });
        result.totalPublishedProposals = await Proposal.countDocuments({ influencer: req.user._id, status: 4 });

        next(new OkResponse({ result: result }));
    } catch (error) {
        next(new BadRequestResponse("Server Error"));
    }

});



module.exports = router;
