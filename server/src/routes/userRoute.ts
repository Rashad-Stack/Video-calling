import { Router } from "express";
import {
  createUser,
  deleteItem,
  getUserById,
  getUsers,
  updateItem,
} from "../controllers/userController";

const router = Router();

router.route("/").post(createUser).get(getUsers);
router.route("/:id").get(getUserById).patch(updateItem).delete(deleteItem);
export default router;
