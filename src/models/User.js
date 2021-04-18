const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    provider: new mongoose.Schema({
      name: { type: String, required: true },
      accountId: { type: String, required: true },
    }),
  },
  { timeStamps: true }
);

module.exports = mongoose.model("user", schema);
