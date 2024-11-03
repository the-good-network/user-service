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
 * Verifies a token with the provided secret
 * @param {*} token The token to verify
 * @param {*} secret The secret key to verify the token with
 * @returns The decoded payload of the token
 */
export const verifyAccessToken = (token, secret) => {
  return jwt.verify(token, secret);
};