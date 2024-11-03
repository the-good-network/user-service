import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import { authenticate } from './middleware/authMiddleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Authentication routes
app.use('/auth', authRoutes);

// Protected route example using the authenticate middleware
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: `Hello, user ${req.user.id}!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});