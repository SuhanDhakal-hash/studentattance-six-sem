// ========================================
// STUDENT ATTENDANCE BACKEND
// ========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Database
const { testDatabaseConnection } = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const classRoutes = require("./routes/classRoutes");

// Create app
const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Attendance API is running"
    });
});

// ========================================
// DATABASE TEST
// ========================================

app.get("/test-db", async (req, res) => {
    try {
        const connected = await testDatabaseConnection();

        if (connected) {
            return res.status(200).json({
                success: true,
                message: "MySQL database connected successfully"
            });
        }

        return res.status(500).json({
            success: false,
            message: "MySQL database connection failed"
        });

    } catch (error) {
        console.error("DATABASE TEST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/faculty", facultyRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/classes", classRoutes);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const connected = await testDatabaseConnection();

        if (!connected) {
            console.error("❌ MySQL connection failed.");
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log("STUDENT ATTENDANCE BACKEND");
            console.log(` Server: http://localhost:${PORT}`);
            console.log(" MySQL connected");
            console.log(" Auth routes loaded");
            console.log(" Student routes loaded");
            console.log(" Faculty routes loaded");
            console.log(" Department routes loaded");
            console.log(" Course routes loaded");
            console.log(" Subject routes loaded");
            console.log(" Class routes loaded");
        });

    } catch (error) {
        console.error(" SERVER STARTUP ERROR:");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();