var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var CampaignSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, default: null },
    image: { type: String, default: null },
    type: {
      type: Number,
      enum: [
        1, // campaign
        2, // shoutOut
      ],
    },

    status: {
      type: Number,
      enum: [
        1, // In review
        2, // Active
        3, // In Active / Blocked
        4, // rejected
        5, // Completed
      ],
      default: 1,
    },
    isFavorite: {
      type: Number,
      default: 0,
      enum: [0, 1],
    },
    rejectMessage: { type: String },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },

    category: { type: Number, default: 1 },
    isPhysicalProduct: { type: Boolean, default: false },
    physicalOption: { type: Number, default: false },
    objective: { type: String, default: null },
    service: { type: String, default: null },
    contentImages: [],
    visionImages: [],
    CFA: { type: String, default: null },
    brief: { type: String, default: null },
    description: { type: String, default: null },
    help: [{ type: String, default: null }],
    avoid: [{ type: String, default: null }],
    socialMediaChannel: { type: Number }, // 1:Instagram , 2:Facebook, 3: Tiktok, 4: Youtube

    channels: {
      postType: Number, // 1 for posts and 2 for stories
      tags: [],
      handles: [],
      caption: String,
    },
    budget: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },

    influencer: {
      gender: { type: Number, default: 0 },
      followers: [],
      age: [],
      location: [],
    },
    isTargetAudience: {
      type: Boolean,
      default: false,
    },
    audience: {
      gender: { type: Number, default: 0 },
      target: [],
      location: [],
      description: { type: String }
    },
    startDate: { type: Date, default: Date.now() },
    duration: { type: Number, default: 10 },

    proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
  },
  { timestamps: true },
);

CampaignSchema.plugin(mongoosePaginate);

mongoose.model("Campaign", CampaignSchema);
