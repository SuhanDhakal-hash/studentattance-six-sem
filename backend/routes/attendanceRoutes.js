const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// Test attendance route
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM attendance ORDER BY id DESC"
        );

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Attendance error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch attendance",
            error: error.message
        });
    }
});

// Mark attendance
router.post("/", async (req, res) => {
    try {
        const {
            student_id,
            subject_id,
            class_id,
            faculty_id,
            dte,
            attendance
        } = req.body;

        if (
            !student_id ||
            !subject_id ||
            !class_id ||
            !faculty_id ||
            !dte ||
            !attendance
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (attendance !== "present" && attendance !== "absent") {
            return res.status(400).json({
                success: false,
                message: "Attendance must be present or absent"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO attendance
            (student_id, subject_id, class_id, faculty_id, dte, attendance)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                student_id,
                subject_id,
                class_id,
                faculty_id,
                dte,
                attendance
            ]
        );

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendanceId: result.insertId
        });

    } catch (error) {
        console.error("Mark attendance error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Attendance already exists for this student, subject and date"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message
        });
    }
});

// THIS MUST BE EXACTLY LIKE THIS
module.exports = router;