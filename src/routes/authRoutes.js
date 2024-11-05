import express from "express";
import {
  loginUsingEmail,
  forgotPassword,
  verifyResetCode,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// Route to log in using email and password
router.post("/login", loginUsingEmail);

// Route to log out and clear refresh token
router.post("/logout", logout);

// Route to initiate forgot password process by sending reset code
router.post("/forgot-password", forgotPassword);

// Route to verify the reset code provided by the user
router.post("/verify-reset-code", verifyResetCode);

export default router;
