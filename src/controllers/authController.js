import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwtUtils.js";
import userModel from "../models/userModel.js";

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

    if (!user || !bcrypt.compareSync(password, user.password)) {
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
 * Logs out a user by clearing the refresh token cookie
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns A success message
 */
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  return res
    .status(200)
    .json({
      message: "Logged out successfully",
      action: "Remove access token from client side",
    });
};
