const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const express = require("express");
const passport = require("passport");
const debug = require("debug")("app");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middlewares/errorHandler");

// Start services
require("./services/database");
require("./services/passport");

const app = express();

// Application config
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({ origin: process.env.CLIENT_URL }));

// Development only config
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Order is important
// routes >> error handler
app.use(routes);
app.use(errorHandler);

app.listen(process.env.PORT, () => debug(`⚡ Started on ${process.env.PORT}`));
