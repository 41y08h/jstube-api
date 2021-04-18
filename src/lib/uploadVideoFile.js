const axios = require("axios");

async function uploadVideoFile(buffer) {
  const fileName = uuid();
  const repoUrl = `https://api.github.com/repos/41y08h/GHaaS/contents/${fileName}.mp4`;

  await axios({
    method: "put",
    url: repoUrl,
    data: {
      message: `Add file ${fileName}.mp4`,
      content: buffer.toString("base64"),
    },
    headers: { Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}` },
    maxBodyLength: 5e7,
  });

  return `https://github.com/41y08h/GHaaS/raw/main/${fileName}.mp4`;
}

module.exports = uploadVideoFile;
