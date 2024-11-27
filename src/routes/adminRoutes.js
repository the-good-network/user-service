import express from "express";
import adminController from "../controllers/adminController.js";
import { admin } from "../middleware/adminMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", authenticate, admin, adminController.getAllUsers);
router.get("/user/:id", authenticate, admin, adminController.getUser);

export default router;
