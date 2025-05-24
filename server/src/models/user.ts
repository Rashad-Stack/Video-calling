import { Response } from "express";
import jwt, { Secret, type SignOptions } from "jsonwebtoken";
import mongoose, { Document, Schema } from "mongoose";
import config from "../config/config";

interface IUser extends Document {
  name: string;
  createAuthToken(): string;
  sendCookie(res: Response, token: string): void;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    minLength: 3,
    maxLength: 20,
    trim: true,
  },
});

userSchema.methods.createAuthToken = function (): string {
  // Cast the JWT secret to Secret type
  const jwtSecret: Secret = config.jwtSecret as string;
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn,
  };

  return jwt.sign({ id: this._id }, jwtSecret, options);
};
userSchema.methods.sendCookie = function (res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    secure: process.env.NODE_ENV === "production",
  });
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
