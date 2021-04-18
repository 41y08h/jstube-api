const router = require("express").Router();
const authRoute = require("../middlewares/authRoute");
const getUser = require("../handlers/auth/getUser");
const logout = require("../handlers/auth/logout");
const googleLogin = require("../handlers/auth/googleLogin");

router
  .get("/user", authRoute, getUser)
  .get("/logout", logout)
  .get(["/google", "/google/callback"], googleLogin);

module.exports = router;
