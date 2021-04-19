const router = require("express").Router();
const authRoute = require("../middlewares/authRoute");
const getVideo = require("../handlers/videos/getVideo");
const getVideos = require("../handlers/videos/getVideos");
const uploadVideo = require("../handlers/videos/uploadVideo");
const asyncHandler = require("express-async-handler");

router
  .get("/", asyncHandler(getVideos))
  .get("/:id", asyncHandler(getVideo))
  .post("/", authRoute, asyncHandler(uploadVideo));

module.exports = router;
