import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";
import Video from "../../models/Video";

export default asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.currentUser?.id as string;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  // Video should exist
  const videoExists = await Video.exists({ _id: videoId });
  if (!videoExists) throw res.clientError("Video not found.", 404);

  const comment = new Comment({
    _user: userId,
    _video: videoId,
    text: req.body.text,
  });
  await comment.save();
  res.json(comment);
});
