const Video = require("../../models/Video");
const uploadVideoFile = require("../../lib/uploadVideoFile");

async function uploadVideo(req, res) {
  if (req.files === null) {
    res.status(400);
    throw new Error("No file was found.");
  }
  const file = req.files.file;

  // Terminate early with file size above 50mb
  if (file.mimetype !== "video/mp4") {
    res.status(400);
    throw new Error("File must be of the type mp4.");
  }

  // Terminate early with file size above 50mb
  if (file.size > 5e7) {
    res.status(400);
    throw new Error("File size must not exceed 50MB.");
  }

  const videoUrl = await uploadVideoFile(file.data);
  const video = new Video({ ...req.body, source: videoUrl });
  await video.save();
  // @TODO - Save video in database

  res.status(200).json(video);
}

module.exports = uploadVideo;
