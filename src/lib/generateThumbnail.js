const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

function generateThumbnail({ videoPath, savePath, filename }) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on("end", () => resolve(path.join(savePath, `${filename}.png`)))
      .on("error", reject)
      .screenshots({
        timestamps: ["25%"],
        folder: savePath,
        filename,
      });
  });
}

module.exports = generateThumbnail;
