export default function getUser(req, res) {
  res.json(req.currentUser);
}
