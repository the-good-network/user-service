import { verifyToken, refreshAllTokens } from "../utils/jwtUtils.js";

/**
 * Authenticates the user by checking the access token
 * If the access token is valid, the user is authenticated
 * If the access token is invalid, returns an error
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 * @returns Returns if everything is okay, otherwise returns an error message
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (accessToken) {
      const accessTokenVerification = verifyToken(accessToken);

      if (accessTokenVerification && accessTokenVerification.type == "access") {
        req.id = accessTokenVerification.payload.id;
        return next();
      } else {
        throw new Error("Can't verify access code");
      }
    } else {
      throw new Error("Access code not found");
    }
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired token", error: error.message });
  }
};
