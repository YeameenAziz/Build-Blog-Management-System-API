const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./src/middleware/auth.middleware");
const userRoutes = require("./src/routes/user.routes");
const blogRoutes = require("./src/routes/blog.routes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);

app.get("/", (req, res) => {
    res.send("Blog Management API is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/test", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user
  });
});