import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Route to sign up a new user
router.post("/signup", authController.signupUser);

// Route to log in using email and password
router.post("/login", authController.loginUsingEmail);

// Route to log out and clear refresh token
router.post("/logout", authController.logout);

// Route to initiate forgot password process by sending reset code
router.post("/forgot-password", authController.forgotPassword);

// Route to reset the user's password
router.post("/reset-password", authController.resetPassword);

// Route to verify the reset code provided by the user
router.post("/verify-reset-code", authController.verifyResetCode);

// Route to refresh the access and refresh tokens
router.post("/refresh", authController.refreshTokens);

export default router;
