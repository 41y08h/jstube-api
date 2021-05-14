import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";

export default asyncHandler(async (req, res) => {
  const videoId = req.params.videoId;
  const userId = req.currentUser?.id as string;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const comment = new Comment({
    _user: userId,
    _video: videoId,
    text: req.body.text,
  });
  await comment.save();
  res.json(comment);
});
