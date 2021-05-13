import IUser from "../../interfaces/User";
import asyncHandler from "../../lib/asyncHandler";
import AuthService from "../../services/auth";

export default asyncHandler((req, res) => {
  const token = AuthService.serializeUser(req.currentUser);
  res.redirect(`${process.env.AUTH_REDIRECT_URL}?token=${token}`);
});
