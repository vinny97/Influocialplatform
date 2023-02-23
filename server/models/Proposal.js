var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var ProposalSchema = new mongoose.Schema(
  {
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    proposalType: { type: Number, default: 1, enu: [1, 2] },
    status: {
      type: Number,
      default: 1,
      enum: [
        1, // 1: Applied
        2, // 2: Rebid
        3, // 3: Approved
        4, // 4: Declined
        5, // 5: Published
      ],
    },

    // Proposal is Favorite
    isFavorite: {
      type: Boolean,
      default: false,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },

    // Sent when proposal is sent
    motivation: {
      type: String,
      default: null,
    },
    // Fee when proposal is submitted
    fee: {
      type: Number,
      default: 0,
    },
    rebid: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
      // 0: No
      // 1: Requested
      // 2: rebid
    },
    // Content Submission
    contentStatus: {
      type: Number,
      default: 0,
      enum: [
        0, // 0: Not Applicable
        1, // 1: Applied // Waiting for Approval
        2, // 2: Approved
        3, // 3: Declined
        4, // 4: Published
      ],
    },
    contentPost: [], // Content Images
    contentCaption: {
      type: String,
      default: null,
    },

    // if content is published content publish platform
    contentPublishPlatform: {
      type: Number,
      default: 1,
      enum: [
        1, // 1: Instagram
      ],
    },

    // id of social media post
    contentPublishID: {
      type: String,
      default: null,
    },

    //Outright
    outrightStatus: {
      type: Number,
      default: 0,
      enum: [
        0, // 0: Not Applicable
        1, // 1: Applied / Requested
        2, // 2: Fee Bid
        3, // 3: Approved
        4, // 4: Declined
      ],
    },

    // Outright Fee Set by Influencer
    outrightFee: {
      type: Number,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);
ProposalSchema.plugin(mongoosePaginate);

mongoose.model("Proposal", ProposalSchema);
