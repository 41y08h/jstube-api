const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const mongoose = require("mongoose");
const debug = require("debug")("app");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

require("./services/passport");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    debug("⚡ Database connected");
  });

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    maxAge: 60 * 1000 * 60 * 24 * 7,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(fileUpload());
app.use("/public", express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(routes);

app.listen(process.env.PORT, () => {
  debug(`⚡ Started on ${process.env.PORT}`);
});
