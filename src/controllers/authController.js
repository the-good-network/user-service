import argon2 from "argon2";
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
  refreshAllTokens,
} from "../utils/jwtUtils.js";
import { generateResetCode, validateResetCode } from "../utils/utils.js";
import userModel from "../models/userModel.js";
import authModel from "../models/authModel.js";
import { sendForgotPasswordEmail } from "../controllers/emailController.js";

/**
 * Logs in a user by checking the user's credentials
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns A success message and a JWT token
 */
export const loginUsingEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateToken(user.id, "1h");
    const refreshToken = generateRefreshToken(user.id);

    // Send refresh token as an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.header("Authorization", `Bearer ${accessToken}`);

    return res.status(200).json({
      message: "User logged in successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Can't login user" });
  }
};

/**
 * Sends a reset code to the user's email for password reset
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns A success message
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const resetCode = generateResetCode();
    await authModel.insertResetCode(user.id, resetCode);

    // Send forgot password email with reset password
    const response = await sendForgotPasswordEmail(
      process.env.RESEND_DEFAULT_EMAIL,
      email,
      resetCode
    );

    if (response && response.status === 200) {
      return res.status(200).json({
        message: "Reset code sent to your email. Please check your inbox.",
      });
    } else {
      return res.status(500).json({ message: "Error sending reset email" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Can't process forgot password request",
      error: error.message,
    });
  }
};

/**
 * Verifies the reset code for password reset
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns A success message
 */
export const verifyResetCode = async (req, res) => {
  const { userID, enteredCode } = req.body;

  try {
    const resetData = await authModel.getResetCode(userID);

    if (!resetData) {
      return res.status(404).json({ message: "No reset code found" });
    }

    const { resetCode, expirationTime } = resetData.data;

    const isValid = validateResetCode(enteredCode, resetCode, expirationTime);

    if (isValid) {
      // Generate a reset token and store it as an HTTP-only cookie
      const resetToken = generateToken(userID, "10m");

      res.cookie("resetToken", resetToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 10 * 60 * 1000,
      });

      // Delete reset code from database after use
      await authModel.deleteResetCode(userID);

      return res.status(200).json({ message: "Reset code verified" });
    } else {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't verify reset code", error: error.message });
  }
};

/**
 * Logs out a user by clearing the refresh token cookie
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns A success message
 */
export const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.status(200).json({
    message: "Logged out successfully",
    action: "Remove access token from client side",
  });
};

/**
 * Refreshes the access and refresh token using a valid refresh token
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns A new access token
 */
export const refreshTokens = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const refreshTokenVerification = verifyToken(refreshToken, "refresh");

    // Verification failed
    if (!refreshTokenVerification) {
      return res.status(401).json({
        message: "Can't verify refresh token",
        action: "User needs to login",
      });
    }

    const { newAccessToken, newRefreshToken } = refreshAllTokens(
      refreshTokenVerification
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);

    return res.status(200).json({ message: "Successfully refreshed tokens" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Can't refresh access token", error: error.message });
  }
};
