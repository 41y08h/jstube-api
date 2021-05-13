import { RequestHandler } from "express";

export default function asyncHandler(handler: RequestHandler): RequestHandler {
  const strongHandler: RequestHandler = (req, res, next) => {
    const fnReturn = handler(req, res, next);
    return Promise.resolve(fnReturn).catch(next);
  };

  return strongHandler;
}
