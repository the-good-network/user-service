import express from "express";
import userRoutes from "./routes/userRoutes.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to user service Microservice!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});