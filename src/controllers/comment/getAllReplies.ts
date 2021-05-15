import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";

export default asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const doesExist = await Comment.exists({ _id: commentId });
  if (!doesExist) throw res.clientError("Comment not found.", 404);

  const replies = await Comment.find({ _replyTo: commentId });
  res.json(replies);
});
