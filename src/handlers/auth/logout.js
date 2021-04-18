function logout(req, res) {
  res.clearCookie("token").redirect(process.env.CLIENT_URL);
}

module.exports = logout;
