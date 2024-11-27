import express from "express";
import userController from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", userController.signupUser);
router.post("/reset-password", userController.resetPassword);

router.get("/", authenticate, userController.getOwnProfile)

export default router;
