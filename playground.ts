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
        foreignField: "_replyTo",
        pipeline: [{}],
        as: "replies",
      },
    },
  ]);
  console.log(JSON.stringify(comments, null, 2));
})();
