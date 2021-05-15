import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";

export default asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.currentUser?.id as string;

  const exists = await Comment.exists({ _id: commentId });
  if (!exists) throw res.clientError("Comment not found.", 404);

  // Delete replies
  await Comment.deleteMany({ _replyTo: commentId });

  const status = await Comment.deleteOne({ _id: commentId, _user: userId });
  if (status.n === 1) return res.sendStatus(200);

  throw res.clientError("Something went wrong.");
});
