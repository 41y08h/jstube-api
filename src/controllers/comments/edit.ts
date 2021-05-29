import asyncHandler from "../../lib/asyncHandler";
import db from "../../lib/db";

export default asyncHandler(async (req, res) => {
  const commentId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const { text } = req.body;

  if (!text) throw res.clientError("Text field is required.", 422);

  const {
    rows: [comment],
    rowCount,
  } = await db.query(
    `
    update "Comment"
    set text = $1
    where id = $2 and 
          "userId" = $3
    returning *
  `,
    [text, commentId, userId]
  );

  if (!rowCount) throw res.clientError("There was a problem", 422);

  res.json(comment);
});
