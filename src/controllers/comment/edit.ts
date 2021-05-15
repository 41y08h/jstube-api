import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";

export default asyncHandler(async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.currentUser?.id as string;

  const { text } = req.body;

  if (!text) throw res.clientError("Text field is required.", 422);
  const status = await Comment.updateOne(
    { _id: commentId, _user: userId },
    { text }
  );

  if (status.n === 1)
    return res.json(await Comment.findOne({ _id: commentId }));

  throw res.clientError("Comment not found.", 404);
});
