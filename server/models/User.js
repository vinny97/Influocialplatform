let mongoose = require("mongoose");
let uniqueValidator = require("mongoose-unique-validator");
let crypto = require("crypto");
let jwt = require("jsonwebtoken");
let secret = require("../config").secret;

var instagramSchema = require("./Instagram");

let faker = require("faker");
const mongoosePaginate = require("mongoose-paginate-v2");
let UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },

    status: {
      type: Number,
      default: 1, // default 1- Active
      enum: [
        1, // 1: Active
        2, // 2: Inactive
      ],
    },

    role: {
      type: Number,
      default: 2, // default Influencer
      enum: [
        1, // 1: Admin
        2, // 2: Influencer
        3, // 3: Brand
        4, // 4: Agency
      ],
    },

    firstName: { type: String, required: [true, "can't be blank"] },
    lastName: { type: String, required: [true, "can't be blank"] },
    image: String,

    isOnline: { type: Boolean, default: false },

    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    contact: {
      type: String,
    },
    gender: {
      type: Number,
    },
    dob: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postCode: String,
      country: String,
    },

    companyName: {
      type: String,
    },
    companySize: {
      type: Number,
    },

    instagram: {
      type: Object,
    },

    hash: String,
    salt: String,

    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: Number,
  },
  { timestamps: true },
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(mongoosePaginate);
UserSchema.methods.validPassword = function (password) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};
UserSchema.methods.setOTP = function () {
  this.otp = faker.random.number({ max: 9999, min: 999 });
  this.otpExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateJWT = function () {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret,
  );
};
UserSchema.methods.fullName = function () {
  return `${this.firstName} ${this.lastName}`;
};
UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    image: this.image || "images/user.jpg",
    role: this.role,
    token: this.generateJWT(),
    isOnline: true,
    isEmailVerified: this.isEmailVerified,
    isProfileComplete: this.isProfileComplete,
    instagram: this.instagram,
    rating: this.rating,
  };
};

module.exports = mongoose.model("User", UserSchema);
