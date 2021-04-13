const router = require("express").Router();
const passport = require("passport");
const requiresAuthentication = require("../middlewares/requiresAuthentication");

router.get("/current-user", requiresAuthentication, (req, res) => {
  res.json(req.user);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

router.get(
  ["/google", "/google/callback"],
  passport.authenticate("google", {
    scope: ["email", "profile"],
  }),
  (req, res) => res.redirect(`${process.env.CLIENT_URL}`)
);

module.exports = router;
