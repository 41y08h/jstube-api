const router = require("express").Router();
const authRoute = require("../middlewares/authRoute");
const getVideo = require("../handlers/videos/getVideo");
const getVideos = require("../handlers/videos/getVideos");
const uploadVideo = require("../handlers/videos/uploadVideo");

router
  .get("/", getVideos)
  .get("/:id", getVideo)
  .post("/", authRoute, uploadVideo);

module.exports = router;
