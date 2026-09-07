const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, name, code
            FROM subjects
            ORDER BY id DESC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET SUBJECTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch subjects",
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
            FROM subjects
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("GET SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch subject",
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
            "SELECT id FROM subjects WHERE code = ?",
            [code]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Subject code already exists"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO subjects (name, code)
            VALUES (?, ?)
            `,
            [name, code]
        );

        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            subjectId: result.insertId
        });
    } catch (error) {
        console.error("CREATE SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create subject",
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
            FROM subjects
            WHERE code = ?
              AND id != ?
            `,
            [code, id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Subject code already exists"
            });
        }

        const [result] = await pool.query(
            `
            UPDATE subjects
            SET name = ?, code = ?
            WHERE id = ?
            `,
            [name, code, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject updated successfully"
        });
    } catch (error) {
        console.error("UPDATE SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update subject",
            error: error.message
        });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM subjects WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject deleted successfully"
        });
    } catch (error) {
        console.error("DELETE SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete subject",
            error: error.message
        });
    }
});

module.exports = router;