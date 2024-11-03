import { verifyAccessToken } from "../utils/jwtUtils.js";

/**
 *
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {*} next The next middleware function
 * @returns Returns if everything is okay, otherwise returns an error message
 */
export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const payload = verifyAccessToken(token, process.env.JWT_SECRET);
      req.user = payload;
      next();
    } catch (error) {
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
