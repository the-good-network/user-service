import express from "express";
import { loginUsingEmail, refreshToken, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUsingEmail);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
