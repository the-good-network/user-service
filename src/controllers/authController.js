import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user.id);
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

    const { resetCode, expirationTime } = resetData;

    const isValid = validateResetCode(enteredCode, resetCode, expirationTime);

    if (isValid) {
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
  res.clearCookie("refreshToken");
  return res.status(200).json({
    message: "Logged out successfully",
    action: "Remove access token from client side",
  });
};
