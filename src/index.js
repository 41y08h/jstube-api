const express = require("express");
const data = require("./data.json");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cors());

// Development configs
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/data", (req, res) => {
  res.json(data);
});

app.get("/video/:id", (req, res) => {
  const requestedVideoId = req.params.id;

  const foundVideo = data.find((video) => video.id == requestedVideoId);
  foundVideo ? res.json(foundVideo) : res.sendStatus(404);
});

app.listen(process.env.PORT, () =>
  console.log(`⚡ Started on ${process.env.PORT}`)
);
