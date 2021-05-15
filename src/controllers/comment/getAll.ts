import asyncHandler from "../../lib/asyncHandler";
import Comment from "../../models/Comment";
import mongoose from "mongoose";

export default asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.aggregate([
    {
      $match: {
        _video: new mongoose.Types.ObjectId(videoId),
        _replyTo: { $exists: false },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "_baseComment",
        as: "replies",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_user",
        foreignField: "_id",
        as: "_user",
      },
    },
    { $unwind: "$_user" },
    {
      $project: {
        "_user.name": 1,
        "_user.picture": 1,
        text: 1,
        createdAt: 1,
        updatedAt: 1,
        _video: 1,
        replyCount: { $size: "$replies" },
      },
    },
  ]);
  res.json(comments);
});
