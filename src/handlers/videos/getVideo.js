const mongoose = require("mongoose");
const Video = require("../../models/Video");

async function getVideo(req, res) {
  const requestedVideoId = req.params.id;
  const isValidId = mongoose.isValidObjectId(requestedVideoId);

  if (!isValidId) res.clientError("Video id is not valid");

  const foundVideo = await Video.find({ _id: requestedVideoId });
  if (foundVideo) return res.json(foundVideo);

  res.status(404);
  throw new Error("Video not found");
}

module.exports = getVideo;
