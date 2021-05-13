import axios from "axios";

export default async function uploadToCloud(base64: string, filename: string) {
  const repo = `https://api.github.com/repos/41y08h/GHaaS/contents/${filename}`;

  await axios({
    method: "PUT",
    url: repo,
    data: {
      message: `Add file ${filename}`,
      content: base64,
    },
    headers: { Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}` },
    maxBodyLength: 5e8,
  });

  return `https://github.com/41y08h/GHaaS/raw/main/${filename}`;
}
