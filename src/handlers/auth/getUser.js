function getUser(req, res) {
  res.json(req.user);
}

module.exports = getUser;
