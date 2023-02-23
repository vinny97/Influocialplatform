let router = require("express").Router();

router.use("/", require("./users"));
router.use("/manageUser", require("./manageUser"));
router.use("/brand", require("./brand"));
router.use("/campaign", require("./campaign"));
router.use("/proposal", require("./proposal"));
router.use("/group", require("./group"));
router.use("/stat", require("./stat"));
router.use("/friend", require("./friend"));
router.use("/values", require("./values"));
router.use("/instagram", require("./instagram"));
router.use("/schedulepost", require("./scheduledPosts"));
router.use("/collaborations", require("./collaborations"));
router.use("/scraper", require("./scraper"));

router.use("/chat", require("./chat"));
router.use("/notification", require("./notification"));

router.use("/upload", require("./upload"));

router.use("/settings", require("./settings"));
router.use("/transaction", require("./transaction"));
router.use("/paypal", require("./paypal"));
router.use("/portfolio", require("./portfolio"));

module.exports = router;
