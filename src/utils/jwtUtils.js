import jwt from "jsonwebtoken";

/**
 * Generates an access token for the user
 * @param {*} userID The user's ID to generate the access token for
 * @param {} time The time the token is valid for
 * @returns The generated access token for the user
 */
export const generateToken = (userID, time) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: time });
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
export const verifyToken = (token, tokenType = "access") => {
  try {
    const secret =
      tokenType === "access"
        ? process.env.JWT_SECRET
        : process.env.REFRESH_TOKEN_SECRET;

    const decoded = jwt.verify(token, secret);
    return { type: tokenType, payload: decoded };
  } catch (error) {
    console.error(
      `Token verification failed for ${tokenType} token:`,
      error.message
    );
    return null;
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
  const refreshTokenVerification = verifyToken(refreshToken, "refresh");
  if (refreshTokenVerification && refreshTokenVerification.type === "refresh") {
    // Generate new access and refresh tokens
    const newAccessToken = generateToken(refreshTokenVerification.payload.id);
    const newRefreshToken = generateRefreshToken(
      refreshTokenVerification.payload.id
    );

    return { newAccessToken, newRefreshToken };
  } else {
    return null;
  }
};
