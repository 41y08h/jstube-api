const router = require("express").Router();
const axios = require("axios");
const { v4: uuid } = require("uuid");

router.post("/", async (req, res) => {
  if (req.files === null)
    return res
      .status(400)
      .json({ code: 400, status: "failed", message: "No file was found." });

  const file = req.files.file;

  // Terminate early with file size above 50mb
  if (file.mimetype !== "video/mp4")
    return res.status(400).json({
      code: 400,
      status: "failed",
      message: "File must be of the type mp4",
    });

  // Terminate early with file size above 50mb
  if (file.size > 5e7)
    return res.status(400).json({
      code: 400,
      status: "failed",
      message: "File size must not exceed 50MB",
    });

  const fileName = uuid();

  // Push file to github repo
  try {
    await axios({
      method: "put",
      url: `https://api.github.com/repos/41y08h/GHaaS/contents/${fileName}.mp4`,
      data: {
        message: `Add file ${fileName}.mp4`,
        content: file.data.toString("base64"),
      },
      headers: { Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}` },
      maxBodyLength: 1000000000,
    });
    const fileURL = `https://github.com/41y08h/GHaaS/raw/main/${fileName}.mp4`;
    res.status(201).json({
      code: 201,
      status: "success",
      message: "Video has been uploaded successfully",
      video_url: fileURL,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
