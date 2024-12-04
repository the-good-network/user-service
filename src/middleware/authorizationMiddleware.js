import userModel from "../models/userModel.js";

/**
 * Middleware to check if the user has a specific role
 * @param {string} role The required role
 * @returns Middleware function
 */
export const authorize = (roles) => {
  return async (req, res, next) => {
    const id = req?.id;

    if (!id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found in request" });
    }

    try {
      const user = await userModel.findUserById(id);

      // Check if the user has the required role
      if (
        user &&
        Array.isArray(user.roles) &&
        user.roles.some((role) => roles.includes(role))
      ) {
        return next();
      } else {
        return res.status(403).json({
          message: "You do not have permission to access this resource.",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };
};
