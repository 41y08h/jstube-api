const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const express = require("express");
const passport = require("passport");
const debug = require("debug")("app");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middlewares/errorHandler");
const clientErrors = require("./middlewares/clientErrors");
const connectDb = require("./services/connectDb");
const configurePassport = require("./services/configurePassport");

const app = express();

// Application config
app
  .use(cors({ origin: process.env.CLIENT_URL }))
  .use(passport.initialize())
  .use(express.json())
  .use(cookieParser())
  .use(fileUpload())
  .use(helmet())
  .use(clientErrors)
  .use(routes)
  .use(errorHandler);

// Development only config
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

configurePassport();
connectDb().then(() => {
  app.listen(process.env.PORT, () =>
    debug(`⚡ Started on ${process.env.PORT}`)
  );
});
