import asyncHandler from "../../lib/asyncHandler";
import Video from "../../models/Video";

export default asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const video = await Video.findById(videoId).populate("_user", "name picture");
  if (video) return res.json(video);

  throw res.clientError("Video not found", 404);
});
