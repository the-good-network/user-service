import userModel from "../models/userModel.js";

const userController = {
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
   * This function gets all users from the database
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns An array of user objects from the database
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      return res.status(200).json({ users });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: "Can't get users" });
    }
  },

  /**
   * This function gets a user's data from the database
   * @param {*} req The request object
   * @param {*} res The response object
   * @returns The user object from the database
   */
  getUser: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await userModel.findUserById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error.message, message: "Can't get user" });
    }
  },
};

export default userController;
