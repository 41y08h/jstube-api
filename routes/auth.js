const router = require("express").Router();
const passport = require("passport");
const requiresAuthentication = require("../middlewares/requiresAuthentication");

router.get("/current-user", requiresAuthentication, (req, res) =>
  res.json(req.user)
);

router.get(
  ["/google", "/google/callback"],
  passport.authenticate("google", {
    scope: ["email", "profile"],
    successRedirect: process.env.CLIENT_URL,
  })
);

module.exports = router;
