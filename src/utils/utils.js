import crypto from "crypto";

/**
 * Generates a secure 6-digit random number as a string.
 * @returns {string} The random 6-digit reset code.
 */
export const generateResetCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Validates the reset code within the specified time frame.
 * @param {string} enteredCode - The code entered by the user.
 * @param {string} emailedCode - The code sent via email.
 * @param {number} expirationTime - The expiration timestamp (in milliseconds).
 * @returns {boolean} True if the code is valid and within the expiration time; otherwise, false.
 */
export const validateResetCode = (enteredCode, emailedCode, expirationTime) => {
  const currentTime = Date.now();
  return enteredCode === emailedCode && currentTime < expirationTime;
};