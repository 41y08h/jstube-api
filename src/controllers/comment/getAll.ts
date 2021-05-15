import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";

export default asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const comments = await Comment.find({
    _video: videoId,
    _replyTo: { $exists: false },
  });
  res.json(comments);
});
