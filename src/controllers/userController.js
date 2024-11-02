import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userController = {
  /**
   * This function creates a new user in the database
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns The created user object and a success message
   */
  signupUser: async (req, res) => {
    const { email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const user = await userModel.createUser(email, username, hashedPassword);
      return res
        .status(201)
        .json({ message: "User created successfully", user: user });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: "Can't create user" });
    }
  },

  /**
   * This function logs in a user by checking the user's credentials
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns A success message and a JWT token
   */
  loginUserUsingEmail: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await userModel.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "30d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res
        .status(200)
        .json({ message: "User logged in", accessToken: accessToken });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: "Can't login user" });
    }
  },

  /**
   * This function gets a user's data from the database
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns The user object from the database
   */
  getUserData: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await userModel.findUserById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user: user });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: "Can't get user" });
    }
  },

  /**
   * This function gets all users from the database
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns An array of user objects from the database
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      return res.status(200).json({ users: users });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: "Can't get users" });
    }
  },
};

export default userController;
