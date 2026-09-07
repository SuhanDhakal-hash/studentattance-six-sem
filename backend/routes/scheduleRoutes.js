const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// GET all schedules
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                s.id,
                s.faculty_id,
                s.subject_id,
                s.class_id,
                s.day,
                s.period
            FROM schedules s
            ORDER BY s.id DESC
        `);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET SCHEDULES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch schedules",
            error: error.message
        });
    }
});

// CREATE schedule
router.post("/", async (req, res) => {
    try {
        const {
            faculty_id,
            subject_id,
            class_id,
            day,
            period
        } = req.body;

        if (
            !faculty_id ||
            !subject_id ||
            !class_id ||
            !day ||
            period === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All schedule fields are required"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO schedules
            (faculty_id, subject_id, class_id, day, period)
            VALUES (?, ?, ?, ?, ?)
            `,
            [faculty_id, subject_id, class_id, day, period]
        );

        res.status(201).json({
            success: true,
            message: "Schedule created successfully",
            scheduleId: result.insertId
        });
    } catch (error) {
        console.error("CREATE SCHEDULE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create schedule",
            error: error.message
        });
    }
});

module.exports = router;