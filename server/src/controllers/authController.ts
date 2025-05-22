import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { users } from "../models/user";

export const login = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    const user = users.find((i) => i.name === name);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};
