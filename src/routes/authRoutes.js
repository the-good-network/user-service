import express from "express";
import { loginUsingEmail, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUsingEmail);
router.post("/logout", logout);

export default router;
