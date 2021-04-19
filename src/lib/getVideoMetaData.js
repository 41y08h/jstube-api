const ffmpeg = require("fluent-ffmpeg");

function getVideoMetaData(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) reject(err);
      resolve(data.streams[0]);
    });
  });
}

module.exports = getVideoMetaData;
