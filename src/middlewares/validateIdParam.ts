import { RequestHandler } from "express";
import mongoose from "mongoose";
import asyncHandler from "../lib/asyncHandler";

const validateIdParam: RequestHandler = asyncHandler((req, res, next) => {
  const id = req.params.id || req.query.id;

  if (mongoose.isValidObjectId(id)) return next();

  throw res.clientError("Id not valid");
});

export default validateIdParam;
