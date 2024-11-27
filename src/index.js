import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { authenticate } from "./middleware/authMiddleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Authentication routes
app.use("/auth", authRoutes);

// User routes
app.use("/user", userRoutes);

// Admin routes
app.use("/admin", adminRoutes);

// Protected route example using the authenticate middleware
app.get("/protected", authenticate, (req, res) => {
  res.json({ message: `Hello, user ${req.id}!` });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
