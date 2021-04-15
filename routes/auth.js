const router = require("express").Router();
const passport = require("passport");
const requiresAuthentication = require("../middlewares/requiresAuthentication");
const jwt = require("jsonwebtoken");

router.get("/current-user", requiresAuthentication, (req, res) => {
  res.json(req.user);
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect(process.env.CLIENT_URL);
});

router.get(
  ["/google", "/google/callback"],
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  }),
  (req, res) => {
    const token = jwt.sign(req.user.id, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
      sameSite: "none",
    });
    res.redirect(`${process.env.CLIENT_URL}/auth-complete?token=${token}`);
  }
);

module.exports = router;
