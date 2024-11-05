import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", userController.signupUser);
router.post("/reset-password", userController.resetPassword);

export default router;
