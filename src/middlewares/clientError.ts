import { RequestHandler } from "express";

const clientError: RequestHandler = (req, res, next) => {
  res.clientError = function clientError(message, code = 400) {
    res.status(code);
    return new Error(message);
  };

  next();
};

export default clientError;
