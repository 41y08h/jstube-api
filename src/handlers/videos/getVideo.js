const data = require("../../data");

function getVideo(req, res) {
  const requestedVideoId = req.params.id;

  const foundVideo = data.find((video) => video.id == requestedVideoId);
  if (foundVideo) return res.json(foundVideo);

  res.status(404);
  throw new Error("Video not found");
}

module.exports = getVideo;
