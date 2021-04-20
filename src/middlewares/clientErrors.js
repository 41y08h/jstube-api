module.exports = function clientErrors(req, res, next) {
  res.clientError = function (message, code) {
    res.status(code || 400);
    throw new Error(message);
  };

  next();
};
