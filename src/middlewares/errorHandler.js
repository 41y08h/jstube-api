function errorHandler(err, req, res, next) {
  const code = req.status || 500;
  res.status(code).json({
    code,
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
  console.error(err);
  next();
}

module.exports = errorHandler;
