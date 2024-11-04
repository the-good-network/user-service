import jwt from "jsonwebtoken";

/**
 * Generates an access token for the user
 * @param {*} userID The user's ID to generate the access token for
 * @returns The generated access token for the user
 */
export const generateAccessToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * Generates a refresh token for the user
 * @param {*} userID The user's ID to generate the refresh token for
 * @returns The generated refresh token for the user
 */
export const generateRefreshToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * Verifies a token with the provided secret keys for access and refresh tokens
 * @param {string} token - The token to verify
 * @returns {Object|null} - The decoded payload of the token, or null if verification fails
 */
export const verifyToken = (token) => {
  try {
    // Try verifying with the access token secret
    const decodedAccess = jwt.verify(token, process.env.JWT_SECRET);
    return { type: "access", payload: decodedAccess };
  } catch (error) {
    // If access token verification fails, try verifying with the refresh token secret
    try {
      const decodedRefresh = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET
      );
      return { type: "refresh", payload: decodedRefresh };
    } catch (refreshError) {
      // If both verifications fail, return null or handle the error appropriately
      console.error("Token verification failed:", refreshError.message);
      return null;
    }
  }
};

/**
 * Refreshes the user's access & refresh tokens
 * Stores the new refresh token in an HTTP-only cookie
 * @param {*} req The request object
 * @param {*} res The response object
 * @returns The latest access token
 */
export const refreshAllTokens = (refreshToken) => {
  const refreshTokenVerification = verifyToken(refreshToken);
  if (refreshTokenVerification && refreshTokenVerification.type === "refresh") {
    // Generate new access and refresh tokens
    const newAccessToken = generateAccessToken(
      refreshTokenVerification.payload.id
    );
    const newRefreshToken = generateRefreshToken(
      refreshTokenVerification.payload.id
    );
    return { newAccessToken, newRefreshToken };
  } else {
    return null;
  }
};
