var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const bcrypt = require("bcrypt");
var CryptoJS = require("crypto-js");
const Secret_Key = require(".././config").SECRET_KEY;
var Instagram = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    username: { type: String, required: true },

    longLiveToken: { type: String, required: true },
  },
  { timestamps: true },
);

Instagram.methods.toInstagramAuthJson = function () {
  return {
    user: this.user,
    username: this.username,
    longLiveToken: { type: String, required: true },
  };
};

Instagram.plugin(mongoosePaginate);

mongoose.model("Instagram", Instagram);
