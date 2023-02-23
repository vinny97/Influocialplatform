var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

var portfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    caption: { type: String, required: true },
    url: { type: String, required: true },
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

portfolioSchema.methods.toJSON = function () {
  return {
    name: this.name,
    image: this.image,
    caption: this.caption,
    influencer: this.influencer,
    url: this.url,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

portfolioSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Portfolio", portfolioSchema);
