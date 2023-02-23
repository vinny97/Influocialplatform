const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ScheduledPostsSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    image: { type: String, required: true },
    postTime: { type: Date, required: true },
    isPosted: { type: Boolean, default: false },
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    proposal: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
  },
  { timestamps: true },
);

ScheduledPostsSchema.methods.scheduledpost = function () {
  return {
    caption: this.caption,
    image: this.image,
    postTime: this.postTime,
    isPosted: this.isPosted,
    scheduledBy: this.scheduledBy,
    campaign: this.campaign,
    proposal: this.proposal,
  };
};

ScheduledPostsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("ScheduledPosts", ScheduledPostsSchema);
