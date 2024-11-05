import {
  verifyToken,
  refreshAllTokens,
} from "../utils/jwtUtils.js";

/**
 * Authenticates the user by checking the access token and refresh token
 * If the access token is valid, the user is authenticated
 * If the access token is invalid, the refresh token is checked and new tokens are generated
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 * @returns Returns if everything is okay, otherwise returns an error message
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const accessTokenVerification = verifyToken(token);

    if (accessTokenVerification && accessTokenVerification.type === "access") {
      // Set the user ID in the request object
      req.id = accessTokenVerification.payload.id;
      return next();
    }
  }

  // If the access token is invalid or expired, check the refresh token from the cookie
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const { newAccessToken, newRefreshToken } = refreshAllTokens(refreshToken);
    // Send the new refresh token as an HTTP-only cookie to extend the session
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    // Also send the new access token in the response body or header
    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    // Set the user ID in the request object
    const newAccessTokenVerification = verifyToken(newAccessToken);
    req.id = newAccessTokenVerification.payload.id;
    return next();
  }

  // If both tokens are invalid or expired
  return res.status(403).json({ message: "Invalid or expired token" });
};
