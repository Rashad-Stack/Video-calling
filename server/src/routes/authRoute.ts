import { Router } from "express";
import {
  authenticatedUser,
  getCurrentUser,
  login,
  logout,
} from "../controllers/authController";

const router = Router();

router.route("/login").post(login);
router.route("/logout").post(authenticatedUser, logout);
router.route("/me").get(authenticatedUser, getCurrentUser);

export default router;
