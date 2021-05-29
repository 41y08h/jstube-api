import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.videoId);
  const userId = req.currentUser?.id as number;

  if (!req.body.text) throw res.clientError("Text is a required field.");

  const {
    rows: [comment],
  } = await db.query(
    `
    insert into "Comment" ("videoId", "userId", text)
    values ($1, $2, $3) returning *
  `,
    [videoId, userId, req.body.text]
  );

  res.json(comment);
});
