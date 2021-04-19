const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authRoute(req, res, next) {
  try {
    const id = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.user = await User.findById(id);

    next();
  } catch {
    res.status(401).json({
      code: res.statusCode,
      message: "You must be logged in to perform this operation",
    });
  }
}

module.exports = authRoute;