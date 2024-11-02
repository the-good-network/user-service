import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/**
 * This function creates a new user in the database
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns The created user object and a success message
 */
export const signupUser = async (req, res) => {
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
};

/**
 * This function logs in a user by checking the user's credentials
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns A success message and a JWT token
 */
export const loginUserUsingEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "User logged in", token: token });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Can't login user" });
  }
};
