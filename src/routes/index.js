const router = require("express").Router();
const videos = require("./videos");
const auth = require("./auth");

router.use("/auth", auth);
router.use("/videos", videos);

module.exports = router;
