import { verifyToken } from "../utils/jwtUtils.js";

/**
 * Middleware to authenticate the user using an access token
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 * @returns Calls next() if the token is valid, otherwise returns an error
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  try {
    // Verify the access token
    const accessTokenVerification = verifyToken(accessToken);

    if (accessTokenVerification && accessTokenVerification.type === "access") {
      req.id = accessTokenVerification.payload.id; // Attach user ID to the request
      return next(); // Proceed to the next middleware or route handler
    }

    throw new Error("Invalid token type or payload");
  } catch (error) {
    // Log the error for debugging purposes (optional)
    console.error("Authentication error: ", error.message);

    return res.status(401).json({
      message: "Invalid or expired access token",
      error: error.message,
    });
  }
};
