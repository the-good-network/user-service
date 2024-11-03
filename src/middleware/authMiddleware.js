import { verifyToken } from "../utils/jwtUtils.js";

/**
 *
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 * @returns Returns if everything is okay, otherwise returns an error message
 */
export const authenticate = (req, res, next) => {
    // Handle refresh token first from the cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      const refreshTokenVerification = verifyToken(refreshToken);
  
      if (refreshTokenVerification && refreshTokenVerification.type === "refresh") {
        // Set the user ID in the request object
        req.user = refreshTokenVerification.payload;
        return next();
      }
    }
    
    // If refresh token verification fails, check the access token from the authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    const accessTokenVerification = verifyToken(token);
  
    if (accessTokenVerification && accessTokenVerification.type === "access") {
      // Set the user ID in the request object
      req.user = accessTokenVerification.payload;
      return next();
    }
  
    // If both tokens are invalid or expired
    return res.status(403).json({ message: "Invalid or expired token" });
  };
