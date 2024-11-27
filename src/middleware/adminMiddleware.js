import userModel from "../models/userModel.js";

/**
 * Middleware to check if the user is an admin
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 */
export const admin = async (req, res, next) => {
  const id = req?.id;

  try {
    const user = await userModel.findUserById(id);

    if (user && user.admin) {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "You do not have access to this resource." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
