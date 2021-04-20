const router = require("express").Router();
const authRoute = require("../middlewares/authRoute");
const getUser = require("../handlers/auth/getUser");
const logout = require("../handlers/auth/logout");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router
  .get("/logout", asyncHandler(logout))
  .get("/user", authRoute, asyncHandler(getUser))
  .get(
    ["/google", "/google/callback"],
    passport.authenticate("google", {
      session: false,
      scope: ["email", "profile"],
    }),
    (req, res) => {
      const token = jwt.sign(req.user.id, process.env.JWT_SECRET);
      res.redirect(`${process.env.CLIENT_URL}/auth-complete?token=${token}`);
    }
  );

module.exports = router;
