require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { testDatabaseConnection } = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const classRoutes = require("./routes/classRoutes");
const classSubjectRoutes = require("./routes/classSubjectRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student Attendance API is running"
    });
});


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


app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/class-subjects", classSubjectRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const connected = await testDatabaseConnection();

        if (!connected) {
            console.error(" MySQL connection failed.");
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log("STUDENT ATTENDANCE BACKEND");
            console.log(`Server: http://localhost:${PORT}`);
            console.log(" MySQL connected");
            console.log(" All routes loaded");
        });

    } catch (error) {
        console.error(" SERVER STARTUP ERROR:");
        console.error(error.message);
        process.exit(1);
    }
}

startServer();