const router = require("express").Router();
const videos = require("./videos");
const auth = require("./auth");
const upload = require("./upload");

router.get("/", (req, res) => {
  res.send("API is running");
});

router.use("/auth", auth);
router.use("/upload", upload);
router.use("/videos", videos);

module.exports = router;
