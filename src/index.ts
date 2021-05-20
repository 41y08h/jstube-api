import "dotenv/config";
import express from "express";
import createDebug from "debug";
import AuthService from "./services/auth";
import router from "./routes";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import passport from "passport";
import parseUser from "./middlewares/parseUser";
import clientError from "./middlewares/clientError";
import errorHandler from "./middlewares/errorHandler";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import cors from "cors";

async function main() {
  const app = express();
  const debug = createDebug("app");

  AuthService.configure();

  const isDevEnv = process.env.NODE_ENV === "development";
  if (isDevEnv) app.use(morgan("dev"));

  app.use(cors());
  app.use(express.json());
  app.use(fileUpload());
  app.use(helmet());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(parseUser);
  app.use(clientError);
  app.use(router);
  app.use(errorHandler);

  app.listen(process.env.PORT, () => {
    debug(`🚀 Ready on port ${process.env.PORT}`);
  });
}

main();
