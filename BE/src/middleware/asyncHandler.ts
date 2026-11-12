import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (
  req: any,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown;

/**
 * Membungkus handler async agar rejection otomatis diteruskan ke
 * global error handler (`next(error)`), sehingga controller tidak perlu try/catch.
 */
export const asyncHandler = (handler: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
