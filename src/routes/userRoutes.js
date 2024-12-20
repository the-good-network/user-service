import express from "express";
import userController from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticationMiddleware.js";
import { authorize } from "../middleware/authorizationMiddleware.js";

const router = express.Router();

// User route to get own profile
router.get("/", authenticate, userController.getOwnProfile);

// Admin route to get all users
router.get(
  "/users",
  authenticate,
  authorize(["admin"]),
  userController.getAllUsers
);

// Admin route to get a user by ID
router.get(
  "/user/:id",
  authenticate,
  authorize(["admin"]),
  userController.getUser
);

export default router;
