const mongoose = require("mongoose");
const debug = require("debug")("app");

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(process.env.MONGO_URI, mongoConfig)
  .then(() => debug("⚡ Database connected"));
