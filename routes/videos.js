const router = require("express").Router();
const data = require("../data.json");

router.get("/", (req, res) => {
  res.json(data);
});

router.get("/:id", (req, res) => {
  const requestedVideoId = req.params.id;

  const foundVideo = data.find((video) => video.id == requestedVideoId);
  foundVideo ? res.json(foundVideo) : res.sendStatus(404);
});

module.exports = router;
