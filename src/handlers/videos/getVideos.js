const data = require("../../data");

function getVideos(req, res) {
  res.json(data);
}

module.exports = getVideos;
