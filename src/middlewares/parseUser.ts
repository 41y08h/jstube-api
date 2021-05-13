import AuthService from "../services/auth";
import { RequestHandler } from "express";

const parseUser: RequestHandler = async (req, res, next) => {
  const user = await AuthService.deserializeUser(req.cookies.token);
  req.currentUser = user;
  next();
};

export default parseUser;
