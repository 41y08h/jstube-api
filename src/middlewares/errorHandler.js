function errorHandler(err, req, res, next) {
  // Override false 200 codes
  if (res.statusCode === 200) res.status(500);

  const code = res.statusCode || 500;

  const envNotProduction = process.env.NODE_ENV !== "production";
  const isClientError = code > 399 && code < 500;

  res.status(code).json({
    code,
    message: err.message,
    stack: envNotProduction
      ? isClientError
        ? undefined
        : err.stack
      : undefined,
  });
}

module.exports = errorHandler;
