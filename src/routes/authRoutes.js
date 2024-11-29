import express from "express";
import {
  loginUsingEmail,
  forgotPassword,
  verifyResetCode,
  logout,
  refreshTokens,
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

// Route to refresh the access and refresh tokens
router.post("/refresh", refreshTokens);

export default router;
