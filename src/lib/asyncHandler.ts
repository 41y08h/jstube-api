import { NextFunction, Request, RequestHandler, Response } from "express";

export default function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => any
): RequestHandler {
  const strongHandler: RequestHandler = (req, res, next) => {
    const fnReturn = handler(req, res, next);
    return Promise.resolve(fnReturn).catch(next);
  };

  return strongHandler;
}
