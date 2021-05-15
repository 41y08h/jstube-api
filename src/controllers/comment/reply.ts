import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";

export default asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.currentUser?.id;

  const { text } = req.body;
  if (!text) throw res.clientError("Text field is required.", 422);

  const replyToComment = await Comment.findById(commentId);
  if (!replyToComment) throw res.clientError("Comment not found.", 404);

  const isReplyingToBase = !Boolean(replyToComment._replyTo);

  const replyComment = new Comment({
    _video: replyToComment._video,
    _user: userId,
    text,
    _replyTo: commentId,
    _baseComment: isReplyingToBase ? commentId : replyToComment._baseComment,
  });
  await replyComment.save();

  res.json(replyComment);
});
