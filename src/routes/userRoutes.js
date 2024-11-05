import express from "express";
import userController from "../controllers/userController.js";
import { admin } from "../middleware/userMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", userController.signupUser);
router.post("/reset-password", userController.resetPassword);

// Admin routes
router.get("/all", authenticate, admin, userController.getAllUsers);
router.get("/:id", authenticate, admin, userController.getUser);

router.get("/", authenticate, userController.getOwnProfile)

export default router;
