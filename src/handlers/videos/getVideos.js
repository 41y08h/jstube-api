const Video = require("../../models/Video");

async function getVideos(req, res) {
  const videos = await Video.find().populate("_user", "name");
  res.json(videos);
}

module.exports = getVideos;
