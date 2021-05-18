import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import passport from "passport";
import AuthController from "../controllers/auth";

const auth = Router();

auth.get("/user", authenticate, AuthController.getUser);

auth.get(
  ["/google", "/google/callback"],
  passport.authenticate("google", { session: false }),
  AuthController.completeOAuth
);

export default auth;
