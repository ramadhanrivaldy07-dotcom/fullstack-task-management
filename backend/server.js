const express = require("express");
const cors = require("cors");
require("dotenv").config();

// DB nya :
const db = require("./src/config/database");
// Auth nya :
const authRoutes = require("./src/routes/authRoutes");
// Middleware nya :
const authenticateToken = require("./src/middleware/authMiddleware");
// Task nya :
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Kanggo Task Management API is running"
    });
});

app.get("/api/profile", authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

app.get("/api/health", async (req, res) => {
    try {
        await db.query("SELECT 1");

        res.json({
            success: true,
            database: "connected"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            database: "disconnected"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});