import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  console.error(err);
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
