import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { User, users } from "../models/user";

// Create an item
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const newUser: User = { id: Date.now(), name };
    users.push(newUser);
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Read all items
export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

// Read single item
export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = users.find((i) => i.id === id);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Item not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update an item
export const updateItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    const itemIndex = users.findIndex((i) => i.id === id);
    if (itemIndex === -1) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Item not found" });
      return;
    }
    users[itemIndex].name = name;
    res.json(users[itemIndex]);
  } catch (error) {
    next(error);
  }
};

// Delete an item
export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const itemIndex = users.findIndex((i) => i.id === id);
    if (itemIndex === -1) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Item not found" });
      return;
    }
    const deletedItem = users.splice(itemIndex, 1)[0];
    res.status(StatusCodes.NO_CONTENT).json(deletedItem);
  } catch (error) {
    next(error);
  }
};
