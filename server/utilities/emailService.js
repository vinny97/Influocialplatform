const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const smtpAuth = require("../config").smtpAuth;

const sendEmail = (mailDetails) => {
  console.log("SMTP Creds:", smtpAuth);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: smtpAuth,
  });
  // Open template file
  var source = fs.readFileSync(
    path.join(__dirname, "../templates/email.hbs"),
    "utf8"
  );
  // Create email generator
  var template = Handlebars.compile(source);
  transporter.sendMail(
    { ...mailDetails, html: template(mailDetails.templateObj) },
    function (err, info) {
      if (err) {
        console.log('error in email sending', err)
      } else {
        console.log("Email sent", info);
      }
    }
  );
};

const sendEmailVerificationOTP = async (user) => {
  sendEmail({
    from: " Influocial Notification <donotreply@Influocial.com>",
    to: user.email,
    subject: "Influocial Email Verification",
    templateObj: {
      ...user,
      emailText: `<p>Please verify that your email address is ${user.email} and that you entered it when signing up for Influocial.</p>
       <p>Enter this OTP to complete the Signup.</p>`,
    },
  });
};


const sendEmailVerificationSuccess = async (user) => {
  sendEmail({
    from: " Influocial Notification <donotreply@Influocial.com>",
    to: user.email,
    subject: "Your Email verified successfully",
    templateObj: {
      ...user,
      emailText: `
      <h1>Welcome to Influocial</h1>. <br>
        you have successfully verified your email address. <br>
        <i>Let's Play</i>
      `,
    },
  });
};
const sendEmailOTP = async (user) => {
  sendEmail({
    from: " Influocial Notification <donotreply@Influocial.com>",
    to: user.email,
    subject: "OTP Request",
    templateObj: {
      ...user,
      emailText: `
      <p>We received an OTP request on your Influocial Account.</p>.
      <p>Enter this OTP to complete the process.</p>
      `,
    },
  });
};

const sendEmailForgotPasswordSuccess = async (user) => {
  sendEmail({
    from: " Influocial Notification <donotreply@Influocial.com>",
    to: user.email,
    subject: "Your Account's password has been reset",
    templateObj: {
      ...user,
      emailText: `
      Your password for the ${user.email} has been reset successfully. <br>
        <i>Let's Play</i>
      `,
    },
  });
};

const sendEmailCreateAdmin = async (user) => {
  sendEmail({
    from: " Influocial Notification <donotreply@Influocial.com>",
    to: user.email,
    subject: "Your Admin Account is live",
    templateObj: {
      ...user,
      emailText: `
      Congratulations – your account is live and ready for action. You now have access to Influocial admin.
      Your password for the ${user.email} need to be reset. <br>
      `,
    },
  });
};
module.exports = {
  sendEmailVerificationOTP,
  sendEmailVerificationSuccess,
  sendEmailOTP,
  sendEmailForgotPasswordSuccess,
  sendEmailCreateAdmin
  // sendEmailForgotPasswordOTP,
};
