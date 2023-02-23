let router = require("express").Router();
let httpResponse = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
let User = mongoose.model("User");



let BadRequestResponse = httpResponse.BadRequestResponse;
let OkResponse = httpResponse.OkResponse;

router.param("userID", function (req, res, next, id) {
    console.log(id);
    User.findById(id).then(function (user) {
        if (!user) {
            return next(new BadRequestResponse("No user Found"));
        }

        console.log(req.userToFind);
        req.userToFind = user;

        return next();
    });
});


router.get('/all', auth.required, auth.admin, function (req, res, next) {
    const options = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 6,
        sort: {
            createdAt: -1,
        },
        select: ['firstName', 'lastName', 'image', 'status', 'role']
    };
    let query = {};
    let searchQuery = null;

    if (req.query) {
        if (req.query.role) {
            query.role = req.query.role;
        }
        // First Name Last Name Search
        if (req.query.nameSearch) {
            let regex = new RegExp(req.query.nameSearch, 'i');
            searchQuery = { $or: [{ firstName: regex }, { lastName: regex }] };
        }
    }

    // if there is a search query $and it with search query
    if (searchQuery) {
        query = { $and: [query, searchQuery] }
    }

    User.paginate(query, options, function (err, result) {
        if (err) {
            next(new BadRequestResponse("Server Error"));
        } else {
            next(new OkResponse({ result: result }));
        }
    });
})

// return User's Data for admin view
router.get('/:userID', auth.required, auth.admin, function (req, res, next) {
    console.log(req.userToFind);
    Promise.all([
        req.userToFind
    ]).then(function (results) {
        next(new OkResponse({ user: req.userToFind }));
    }).catch(next);
});
module.exports = router;
