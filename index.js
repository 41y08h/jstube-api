const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const mongoose = require("mongoose");
const debug = require("debug")("app");
const cookieSession = require("cookie-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");

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

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(routes);

app.listen(process.env.PORT, () => {
  debug(`⚡ Started on ${process.env.PORT}`);
});
