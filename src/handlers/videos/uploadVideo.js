const Video = require("../../models/Video");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const getVideoMetaData = require("../../lib/getVideoMetaData");
const generateThumbnail = require("../../lib/generateThumbnail");
const uploadToCloud = require("../../lib/uploadToCloud");

function throwClientError(res, message) {
  res.status(400);
  throw new Error(message);
}

async function uploadVideo(req, res) {
  if (req.files === null) throwClientError(res, "No file was found");

  const file = req.files.file;

  // Terminate early with file size above 50mb
  if (file.mimetype !== "video/mp4")
    throwClientError(res, "File must be of the type mp4");

  // Terminate early with file size above 50mb
  if (file.size > 5e7) throwClientError(res, "File size must not exceed 50MB");

  // Validate form data
  if (!req.body.title) throwClientError(res, "Title is required");
  if (!req.body.description) throwClientError(res, "Description is required");

  const filename = uuid();
  const tempDir = path.join(__dirname, "../../../temp");
  const videoPath = path.join(tempDir, `${filename}.mp4`);

  // Generate Video
  await file.mv(videoPath);

  // Gather needed metadata
  const { duration } = await getVideoMetaData(videoPath);

  // Generate thumbnail
  const thumbnailPath = await generateThumbnail({
    savePath: tempDir,
    videoPath,
    filename,
  });

  // File have to be encoded in base64
  const videoFile = file.data.toString("base64");
  const thumbnailFile = fs.readFileSync(thumbnailPath, { encoding: "base64" });

  // Upload files
  const videoURL = await uploadToCloud(videoFile, `${filename}.mp4`);
  const thumbnailURL = await uploadToCloud(thumbnailFile, `${filename}.png`);

  // Save in database
  const { title, description } = req.body;

  const video = new Video({
    title,
    description,
    source: videoURL,
    thumbnail: thumbnailURL,
    duration,
    _user: req.user.id,
  });
  await video.save();

  res.json(video);

  // Cleanup temp files on disk
  try {
    fs.unlinkSync(videoPath);
    fs.unlinkSync(thumbnailPath);
  } catch (err) {
    console.log(err);
  }
}

module.exports = uploadVideo;
