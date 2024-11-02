import jwt from "jsonwebtoken";

/**
 * This function generates an access token for the user
 * @param {*} userID The user's ID to generate the access token for
 * @returns The generated access token for the user
 */
const generateAccessToken = (userID) => {
  return jwt.sign(userID, process.env.JWT_SECRET, { expiresIn: "1h" });
};

/**
 * This function generates a refresh token for the user
 * @param {*} userID The user's ID to generate the refresh token for
 * @returns The generated refresh token for the user
 */
const generateRefreshToken = (userID) => {
  return jwt.sign(userID, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * This function verifies the user's access token
 * @param {*} accessToken The user's access token
 * @returns The decoded user's access token
 */
const verifyAccessToken = (accessToken, secret) => {
  return jwt.verify(accessToken, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
};
