const router = require("express").Router();
const authRoute = require("../middlewares/authRoute");
const getUser = require("../handlers/auth/getUser");
const logout = require("../handlers/auth/logout");
const googleLogin = require("../handlers/auth/googleLogin");
const asyncHandler = require("express-async-handler");

router
  .get("/logout", asyncHandler(logout))
  .get("/user", authRoute, asyncHandler(getUser))
  .get(["/google", "/google/callback"], asyncHandler(googleLogin));

module.exports = router;
