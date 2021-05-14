import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";

export default asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.currentUser?.id as string;

  await Comment.deleteOne({ _id: commentId, _user: userId });
  res.sendStatus(200);
});
