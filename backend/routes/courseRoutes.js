const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, name, code
            FROM courses
            ORDER BY id DESC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET COURSES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message
        });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `
            SELECT id, name, code
            FROM courses
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("GET COURSE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch course",
            error: error.message
        });
    }
});


router.post("/", async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Name and code are required"
            });
        }

        const [existing] = await pool.query(
            "SELECT id FROM courses WHERE code = ?",
            [code]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Course code already exists"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO courses (name, code)
            VALUES (?, ?)
            `,
            [name, code]
        );

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            courseId: result.insertId
        });
    } catch (error) {
        console.error("CREATE COURSE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message
        });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "Name and code are required"
            });
        }

        const [existing] = await pool.query(
            `
            SELECT id
            FROM courses
            WHERE code = ?
            AND id != ?
            `,
            [code, id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Course code already exists"
            });
        }

        const [result] = await pool.query(
            `
            UPDATE courses
            SET name = ?, code = ?
            WHERE id = ?
            `,
            [name, code, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully"
        });
    } catch (error) {
        console.error("UPDATE COURSE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update course",
            error: error.message
        });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM courses WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.error("DELETE COURSE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message
        });
    }
});

module.exports = router;