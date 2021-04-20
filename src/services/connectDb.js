const mongoose = require("mongoose");
const debug = require("debug")("app");

async function connectDb() {
  const mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(process.env.MONGO_URI, mongoConfig);
  debug("⚡ Database connected");
}

module.exports = connectDb;
