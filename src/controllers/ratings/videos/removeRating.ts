import asyncHandler from "../../../lib/asyncHandler";
import prisma from "../../../lib/prisma";

export default asyncHandler(async (req, res) => {
  const videoId = parseInt(req.params.id);
  const userId = req.currentUser?.id as number;

  const status = await prisma.videoRating.deleteMany({
    where: { videoId, userId },
  });

  if (status.count) return res.sendStatus(200);

  throw res.clientError("Something went wrong.");
});
