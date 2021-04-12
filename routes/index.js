const router = require("express").Router();
const videos = require("./videos");
const auth = require("./auth");

router.get("/", (req, res) => {
  res.send("API is running");
});

router.use("/videos", videos);
router.use("/auth", auth);

module.exports = router;
