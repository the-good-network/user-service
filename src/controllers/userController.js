import bcrypt from "bcryptjs";
import { verifyToken } from "../utils/jwtUtils.js";
import userModel from "../models/userModel.js";
import { sendSignupEmail } from "./emailController.js";

const userController = {
  /**
   * This function creates a new user in the database
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns The created user object and a success message
   */
  signupUser: async (req, res) => {
    const { email, username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.createUser(email, username, hashedPassword);

      if (user) {
        try {
          await sendSignupEmail(
            process.env.RESEND_DEFAULT_EMAIL,
            email,
            username
          );
        } catch (emailError) {
          console.error("Error sending signup email:", emailError.message);
        }
      }

      return res
        .status(201)
        .json({ message: "User created successfully", user });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: "Can't create user" });
    }
  },

  /**
   * Retrieves the authenticated user's profile
   * @param {*} req The request object
   * @param {*} res The response object
   */
  getOwnProfile: async (req, res) => {
    const id = req.id; // User ID from the authenticate middleware

    try {
      const user = await userModel.findUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "Retrieved user info", user: user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Can't get user profile", error: error.message });
    }
  },

  /**
   * Resets the user's password
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns Success or error message
   */
  resetPassword: async (req, res) => {
    const { newPassword } = req.body;
    const resetToken = req.cookies.resetToken;

    if (!resetToken) {
      return res
        .status(401)
        .json({ message: "Reset token not found or expired" });
    }

    try {
      const decoded = verifyToken(resetToken);
      if (!decoded) {
        return res
          .status(401)
          .json({ message: "Invalid or expired reset token" });
      }

      const userID = decoded.payload.id;
      if (!userID) {
        return res.status(404).json({ message: "User does not exist" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userModel.updateUser(userID, {
        password: hashedPassword,
      });

      // Clear the reset token cookie after password reset
      res.clearCookie("resetToken");

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  },
};

export default userController;
