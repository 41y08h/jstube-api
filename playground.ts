import "dotenv/config";
import DatabaseService from "./src/services/database";
import Comment from "./src/models/Comment";

(async () => {
  await DatabaseService.connect();

  const comments = await Comment.aggregate([
    { $match: { _replyTo: { $exists: false } } },
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
  console.log(JSON.stringify(comments, null, 2));
})();
