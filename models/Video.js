const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    thumb: {
      type: String,
      required: true,
    },
    provider: new mongoose.Schema({
      name: { type: String, required: true },
      accountId: { type: String, required: true },
    }),
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", schema);
