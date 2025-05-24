import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/user";

// Create an item
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Please provide all values!",
      });
    }

    // Creating  new user
    const user = await User.create({ name });
    const token = user.createAuthToken();
    user.sendCookie(res, token);
    res.status(StatusCodes.CREATED).json({
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Read all items
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({});
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

// Read single item
export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const user = User.findById(id);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Item not found" });
      return;
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

// Update an item
export const updateItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const updatedUser = User.findByIdAndUpdate(id, { name }, { new: true });
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete an item
export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const deletedUser = User.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json(deletedUser);
  } catch (error) {
    next(error);
  }
};
