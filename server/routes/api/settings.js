let router = require("express").Router();
let {
    OkResponse,
    BadRequestResponse,
    UnauthorizedResponse,
  } = require("express-http-response");
const auth = require("../auth");
let mongoose = require("mongoose");
let Settings = mongoose.model("Settings");


router.post('/', auth.required, auth.user, (req ,res, next) => {
    Settings.findOne((err, settings) => {
        return next(new OkResponse(settings));
    });
});

router.post('/', auth.required, auth.admin, (req, res, next) => {
    Settings.findOne((err, settings) => {
        if(req.body.paypalClientID)
            settings.paypalClientID = req.body.paypalClientID;

        if(req.body.paypalClientSecret)
            settings.paypalClientSecret = req.body.paypalClientSecret;
        
        settings.save((err, settings) => {
            return next(new OkResponse(settings));
        });
    });
})



module.exports = router;