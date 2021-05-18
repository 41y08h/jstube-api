import { User } from ".prisma/client";
import asyncHandler from "../../lib/asyncHandler";
import AuthService from "../../services/auth";

export default asyncHandler((req, res) => {
  const token = AuthService.serializeUser(req.user as User);
  res.redirect(`${process.env.AUTH_REDIRECT_URL}?token=${token}`);
});
