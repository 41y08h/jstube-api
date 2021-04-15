const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function requiresAuthentication(req, res, next) {
  console.log(req.headers);
  try {
    const id = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.user = await User.findById(id);

    next();
  } catch {
    return res.status(401).json({
      message: "You must be logged in to perform this operation",
    });
  }
}

module.exports = requiresAuthentication;
