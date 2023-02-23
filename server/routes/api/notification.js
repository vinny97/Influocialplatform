let mongoose = require("mongoose");
let Notification = mongoose.model("Notification");
let router = require("express").Router();
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
let auth = require("../auth");

const { sendNotification } = require("../../utilities/notification");

router.get("/create", function (req, res, next) {
  sendNotification({
    title: "Notification testing",
    type: 1,
    sentTo: "630e3b2a49f82e000fba7ef0",
    // This is a test userId 
    // sentTo: "62ffafb2ac075d34b8b6ff71"
  });
  next(new OkResponse({ message: "notification sent" }));
});

router.post("/", auth.required, auth.user, function (req, res, next) {
  console.log("Sending notif to user");
  const options = {
    page: +req.query.page || 1,
    limit: +req.query.page || 10,
    sort: { createdAt: -1 },
    populate: "user",
    useCustomCountFn: function () {
      // @ts-ignore
      return Notification.count({ sentTo: req.user._id, isRead: false });
    },
  };
  Notification.paginate(
    { sentTo: req.user._id },
    options,
    function (err, result) {
      if (err) {
        next(new BadRequestResponse("Server Error"));
      }
      next(new OkResponse({ result: result }));
    },
  );
});
router.post("/mark-all", auth.required, auth.user, function (req, res, next) {
  Notification.updateMany(
    { sentTo: req.user._id, isRead: false },
    { $set: { isRead: true } },
    function (err, result) {
      if (err) {
        next(new BadRequestResponse("Server Error"));
      }
      next(new OkResponse());
    },
  );
});
router.post(
  "/mark-as-read/:notificationId",
  auth.required,
  auth.user,
  function (req, res, next) {
    Notification.updateOne(
      { sentTo: req.user._id, _id: req.params.notificationId },
      { $set: { isRead: true } },
      function (err, result) {
        if (err) {
          next(new BadRequestResponse("Server Error"));
        }
        next(new OkResponse());
      },
    );
  },
);

module.exports = router;
