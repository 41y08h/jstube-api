const router = require("express").Router();
const videos = require("./videos");
const upload = require("./upload");
const auth = require("./auth");

router.use("/auth", auth);
router.use("/upload", upload);
router.use("/videos", videos);

module.exports = router;
