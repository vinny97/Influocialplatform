let mongoose = require("mongoose");
let Notification = mongoose.model("Notification");

const sendNotification = ({ title, type, sentTo, user = null, data = {} }) => {
  InfluocialSocket.emit("notification" + sentTo);
  console.log("::sentTo::", sentTo);
  console.log("::title::", title);

  new Notification({
    title,
    type,
    user,
    sentTo,
    data,
  })
    .save()
    .then((doc) => {
      // TODO check here if user is online
    });
};

module.exports = {
  sendNotification,
};
