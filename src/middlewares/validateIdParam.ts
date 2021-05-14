import { RequestHandler } from "express";
import mongoose from "mongoose";
import asyncHandler from "../lib/asyncHandler";

const validateIdParam: (...idKeys: string[]) => RequestHandler = (...idKeys) =>
  asyncHandler((req, res, next) => {
    idKeys.forEach((idKey) => {
      const id = req.params[idKey];

      // If not valid id, send unprocessable entity status
      if (!mongoose.isValidObjectId(id))
        throw res.clientError(`${idKey} not valid.`, 422);
    });

    next();
  });

export default validateIdParam;
