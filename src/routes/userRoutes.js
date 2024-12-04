import express from "express";
import userController from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticationMiddleware.js";
import { authorize } from "../middleware/authorizationMiddleware.js";

const router = express.Router();

router.post("/signup", userController.signupUser);
router.post("/reset-password", userController.resetPassword);

router.get("/", authenticate, userController.getOwnProfile);

router.get(
  "/users",
  authenticate,
  authorize(["admin"]),
  userController.getAllUsers
);

router.get(
  "/user/:id",
  authenticate,
  authorize(["admin"]),
  userController.getUser
);

export default router;
