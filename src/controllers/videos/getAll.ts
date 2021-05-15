import asyncHandler from "../../lib/asyncHandler";
import Video from "../../models/Video";

export default asyncHandler(async (req, res) => {
  res.json(await Video.find().populate("_user", "name picture"));
});
