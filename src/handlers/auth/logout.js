function logout(req, res) {
  res
    .clearCookie("token")
    .json({ code: 200, message: "You've been logged out." });
}

module.exports = logout;
