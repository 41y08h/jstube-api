const passport = require("passport");
const jwt = require("jsonwebtoken");

function googleLogin(req, res) {
  passport.authenticate("google", {
    session: false,
    scope: ["email", "profile"],
  })(req, res);

  const token = jwt.sign(req.user.id, process.env.JWT_SECRET);
  res.redirect(`${process.env.CLIENT_URL}/auth-complete?token=${token}`);
}

module.exports = googleLogin;
