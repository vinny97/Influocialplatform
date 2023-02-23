let router = require("express").Router();
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
let mongoose = require("mongoose");

const auth = require("../auth");
let Chat = mongoose.model("Chat");
let User = mongoose.model("User");
let Friend = mongoose.model("Friend");

router.param("friendID", function (req, res, next, id) {
  Friend.findById(id).then(function (friend) {
    if (!friend) {
      return next(new BadRequestResponse("No User Found"));
    }
    req.friend = friend;
    return next();
  });
});

router.post("/users", auth.required, auth.user, function (req, res, next) {
  let f = [req.user._id];
  User.find(
    { _id: { $nin: f } },
    { _id: 1, email: 1, firstName: 1, lastName: 1, image: 1 },
    function (err, docs) {
      if (err) {
        next(new BadRequestResponse(`Server Error`, 500));
      } else {
        // TODO change this slicing
        next(new OkResponse({ users: docs.slice(0, 9) }));
      }
    },
  );
});

router.post("/:friendID", auth.required, auth.user, function (req, res, next) {
  const options = {
    page: +req.query.page || 1,
    limit: +req.query.limit || 20,
    sort: {
      createdAt: -1,
    },
  };

  let query = {
    friend: req.friend._id,
  };

  Chat.paginate(query, options, function (err, history) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    }
    next(new OkResponse({ history: history }));
  });
});

router.post("/create/:friendID", auth.required, auth.user, function (req, res, next) {
  // save the message and send Event
  let chat = new Chat();
  chat.friend = req.friend._id;
  chat.createdBy = req.user._id;
  chat.sentTo = req.body.sentTo;
  chat.message = req.body.message;
  chat.files = req.body.files;
  console.log("Send to::::::::::::", req.body.sentTo);
  chat.save(function (err, doc) {
    if (err) {
      next(new BadRequestResponse("Server Error"));
    } else {
      req.friend.chatMessages.push(chat._id);
      req.friend.lastMessage = chat._id;
      req.friend.save().then((friend) => {
        InfluocialSocket.emit("conversation" + req.body.sentTo);
        // next(new OkResponse({ proposal: proposal }));
      });
      console.log("Outside the block");
      next(new OkResponse({}));
    }
  });
});

router.post(
  "/count/unread",
  auth.required,
  auth.user,
  function (req, res, next) {
    try {
      let query = {
        sentTo: req.user._id,
        isRead: false,
      };

      Chat.countDocuments(query, function (err, count) {
        if (err) {
          console.log(err);
          next(new BadRequestResponse("Server Error"));
        } else {
          next(new OkResponse({ count: count }));
        }
      });
    } catch (error) {
      console.log(error);
      next(new BadRequestResponse("Server Error"));
    }
  },
);

router.get("/read/:senderID", function (req, res, next) {
  console.log(req.params.senderID);
  console.log(req.query.createdBy);
  try {
    Chat.updateMany(
      { createdBy: req.params.senderID, sentTo: req.query.sentTo },
      { isRead: true },
      function (err, result) {
        if (err) {
          console.log(err);
          next(new BadRequestResponse("Server Error"));
        } else {
          next(new OkResponse());
        }
      },
    );
  } catch (error) {
    console.log(error);
    next(new BadRequestResponse("Server Error"));
  }
});
module.exports = router;
