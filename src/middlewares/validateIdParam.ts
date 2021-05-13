import { RequestHandler } from "express";
import mongoose from "mongoose";

const validateIdParam: RequestHandler = (req, res, next) => {
  const id = req.params.id || req.query.id;

  if (mongoose.isValidObjectId(id)) return next();

  throw res.clientError(400, "Id not valid");
};

export default validateIdParam;
