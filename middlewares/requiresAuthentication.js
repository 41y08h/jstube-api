function requiresAuthentication(req, res, next) {
  if (!req.user)
    return res.status.json({
      message: "You must be logged in to perform this operation",
    });

  next();
}

module.exports = requiresAuthentication;
