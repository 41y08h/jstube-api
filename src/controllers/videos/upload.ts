import asyncHandler from "../../lib/asyncHandler";
import VideosService from "../../services/videos";
import { UploadedFile } from "express-fileupload";

export default asyncHandler(async (req, res) => {
  if (!req.files) throw res.clientError("No file was found");

  const file = req.files.file as UploadedFile;

  if (file.mimetype !== "video/mp4")
    throw res.clientError("File must be of the type mp4");
  if (file.size > 5e7) res.clientError("File size must not exceed 50MB");

  // Validate form data
  if (!req.body.title) throw res.clientError("Title is required");
  if (!req.body.description) throw res.clientError("Description is required");

  const video = await VideosService.upload({
    file,
    body: req.body,
    userId: req.currentUser?.id as number,
  });

  res.json(video);
});
