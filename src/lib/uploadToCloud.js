const axios = require("axios");

async function uploadToCloud(base64Content, fileName) {
  const repoUrl = `https://api.github.com/repos/41y08h/GHaaS/contents/${fileName}`;

  await axios({
    method: "put",
    url: repoUrl,
    data: {
      message: `Add file ${fileName}`,
      content: base64Content,
    },
    headers: { Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}` },
    maxBodyLength: 5e8,
  });

  return `https://github.com/41y08h/GHaaS/raw/main/${fileName}`;
}

module.exports = uploadToCloud;
