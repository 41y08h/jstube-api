const Video = require("../../models/Video");

async function getVideos(req, res) {
  const videos = await Video.find()
    .populate("_user", "name picture")
    .sort([["createdAt", -1]]);
  res.json(videos);
}

module.exports = getVideos;
