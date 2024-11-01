import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const signupUser = async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await userModel.createUser(email, username, hashedPassword);
    res.status(201).json({ message: "User created successfully", user: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
