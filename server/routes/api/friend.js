let router = require("express").Router();
let httpResponse = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
// const { query } = require("express-validator");
let Friend = mongoose.model("Friend");


let BadRequestResponse = httpResponse.BadRequestResponse;
let OkResponse = httpResponse.OkResponse;

router.param("friendID", function (req, res, next, id) {
    Friend.findById(id).then(function (friend) {
        if (!friend) {
            return next(new BadRequestResponse("No friend Found"));
        }
        req.friend = friend;
        return next();
    });
});

router.post('/all', auth.required, auth.user, function (req, res, next) {
    const options = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 10,
        populate: [{
            path: 'user1',
            model: 'User',
            select: '_id firstName lastName image',
        }, {
            path: 'user2',
            model: 'User',
            select: '_id firstName lastName image',
        }, {
            path: 'lastMessage',
            model: 'Chat',
            select: 'createdBy sentTo message createdAt',
        }],
        sort: {
            updatedAt: -1,
        },
    };

    let query = {
        $or: [
            { user1: req.user._id },
            { user2: req.user._id },
        ],
    };

    Friend.paginate(query, options, function (err, result) {
        if (err) {
            console.log(err);
            next(new BadRequestResponse("Server Error"));
        } else {
            next(new OkResponse({ result: result }));
        }
    });
})

// return Friend's Data
router.post('/:friendID', auth.required, auth.user, function (req, res, next) {
    Promise.all([
        req.friend
            .populate('user1', 'firstName lastName image')
            .populate('user2', 'firstName lastName image')
            .execPopulate()
    ]).then(function (results) {
        next(new OkResponse({ friend: req.friend }));
    }).catch(next);
});



// Adds a new Friend
router.post('/', auth.required, auth.user, async function (req, res, next) {
    let query = {
        $or: [
            { user1: req.body.data, user2: req.user._id },
            { user2: req.body.data, user1: req.user._id },
        ],
    };
    let f = await Friend.find(query).exec()
    if (f.length !== 0) {
        next(new OkResponse({ message: "Already Friends" }));
    } else {
        new Friend({ user1: req.user._id, user2: req.body.data })
            .save()
            .then((friend) => {
                next(new OkResponse({ friend: friend }));
            });
    }
});


module.exports = router;
