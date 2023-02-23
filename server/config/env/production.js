"use strict";
const nodemailer = require("nodemailer");
module.exports = {
  PORT: 3000,
  MONGODB_URI: "mongodb+srv://root:Clb%232022@cluster0.ygedpug.mongodb.net/?retryWrites=true&w=majority",
  secret: "secret",
  host: "https://influocial-server.herokuapp.com/",
  smtpAuth: {
    // user: "support@influocial.co.uk",
    // pass: "Pogba#2022",
    user: process.env.EMAIL_SMTP,
    pass: process.env.PASS_SMTP
  },
  // cloudinary_url: process.env.CLOUDINARY_URL,
  // cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  // cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  instagram: { username: "mikesnider123", password: "Asdf123." },
  file_url: "https://influocial-server.herokuapp.com/",
  goldApiServerKey: "goldapi-rhyobukljsd1uh-io",
  USER_ID: 17841441871512114,
  ACCESS_TOKEN:
    "EAAMRdLIZBnn4BADLtJV5fFXrU0eZC3O0eAGJ4juzzR6MSaB672VCAKpICCTg3Rc8KsGPacDI6bjCc7cJZCzFZCpZBnAkU0Lop2O2mo9C7EqJZAm6mvsoj9RXFawwvxJrZASn0m9m7rhxtYmWQ3jygtFVvytuM3tbG0lvjjCfuWsqvxxCnU11OI0X3kIS2YhOSsZD",
};
SECRET_KEY: "51D65F1SD65V4SD65V4S65D4V6SDV1651G51";
