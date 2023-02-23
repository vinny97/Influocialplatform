let router = require("express").Router();
let httpResponse = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
let Group = mongoose.model("Group");
let User = mongoose.model("User");


let BadRequestResponse = httpResponse.BadRequestResponse;
let OkResponse = httpResponse.OkResponse;

router.param("groupID", function (req, res, next, id) {
    Group.findById(id).then(function (group) {
        if (!group) {
            return next(new BadRequestResponse("No group Found"));
        }
        req.group = group;
        return next();
    });
});

// return all past collaborators of user
router.post('/collaborators', auth.required, auth.user, function (req, res, next) {
    const options = {
        page: +req.query.page || 1,
        limit: req.query.limit || 6,
        select: '_id image firstName lastName'
    };

    let query = { _id: { $in: req.user.collaborators } };

    User.paginate(query, options, function (err, result) {
        if (err) {
            next(new BadRequestResponse("Server Error"));
        } else {
            next(new OkResponse({ result: result }));
        }
    });
});

// returns all groups of user as list used in ng select
router.post('/list', auth.required, auth.user, function (req, res, next) {
    const options = {
        sort: { createdAt: -1 },
    };
    let query = { createdBy: req.user._id };
    if (req.query && req.query.userID) {
        query.members = { $ne: req.query.userID }
    }
    Group.paginate(query, options, function (err, result) {
        if (err) {
            next(new BadRequestResponse("Server Error"));
        } else {
            next(new OkResponse({ result: result }));
        }
    });
})

// returns all groups of user
router.post('/all', auth.required, auth.user, function (req, res, next) {
    const options = {
        page: +req.query.page || 1,
        limit: req.query.limit || 6,
        populate: [{
            path: 'members',
            model: 'User',
            select: '_id image firstName lastName',
        }],
        sort: {
            createdAt: -1,
        },
    };
    let query = { createdBy: req.user._id };
    Group.paginate(query, options, function (err, result) {
        if (err) {
            next(new BadRequestResponse("Server Error"));
        } else {
            next(new OkResponse({ result: result }));
        }
    });
})

// return Group's Data
router.post('/:groupID', auth.required, auth.user, function (req, res, next) {
    Promise.all([
        req.group
            .populate('members', '_id image firstName lastName')
            .execPopulate()
    ]).then(function (results) {
        next(new OkResponse({ group: req.group }));
    }).catch(next);
});

// Updates Group
router.post('/:groupID', auth.required, auth.user, function (req, res, next) {
    console.log("====> here", req.body);
    let group = req.body.group;
    if (group && group.member) {
        req.group.members.addToSet(group.member);
        req.group.markModified('members');
    }
    if (group && group.removeMember) {
        req.group.members.pull(group.removeMember);
        req.group.markModified('members');
    }
    if (group && group.title) {
        req.group.title = group.title;
    }
    req.group.save().then(function (g) {
        next(new OkResponse({ group: g }));
    }).catch(next);
});

// delete group
router.post('/:groupID', auth.required, auth.user, function (req, res, next) {
    req.article.remove().then(function () {
        next(new OkResponse({ message: "group deleted" }));
    });
});

// Creates New Group
router.post('/', auth.required, auth.user, function (req, res, next) {
    new Group({ ...req.body.group, createdBy: req.user._id })
        .save()
        .then((group) => {
            next(new OkResponse({ group: group }));
        });
});

module.exports = router;
