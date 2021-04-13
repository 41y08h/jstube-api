function requiresAuthentication(req, res, next) {
  console.log(req.cookies);
  if (!req.user)
    return res.status(401).json({
      message: "You must be logged in to perform this operation",
    });

  next();
}

module.exports = requiresAuthentication;
