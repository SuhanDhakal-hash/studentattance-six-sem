
const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// GET all faculty
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                f.id,
                f.user_id,
                f.name,
                f.code,
                u.email
            FROM faculty AS f
            INNER JOIN users AS u
                ON f.user_id = u.id
            ORDER BY f.id DESC
        `);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET FACULTY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch faculty",
            error: error.message
        });
    }
});

// GET one faculty
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(`
            SELECT
                f.id,
                f.user_id,
                f.name,
                f.code,
                u.email
            FROM faculty AS f
            INNER JOIN users AS u
                ON f.user_id = u.id
            WHERE f.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("GET FACULTY BY ID ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch faculty",
            error: error.message
        });
    }
});

// CREATE faculty
router.post("/", async (req, res) => {
    try {
        const { user_id, name, code } = req.body;

        if (!user_id || !name || !code) {
            return res.status(400).json({
                success: false,
                message: "user_id, name and code are required"
            });
        }

        // Check user
        const [userRows] = await pool.query(
            "SELECT id FROM users WHERE id = ?",
            [user_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check duplicate code
        const [codeRows] = await pool.query(
            "SELECT id FROM faculty WHERE code = ?",
            [code]
        );

        if (codeRows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Faculty code already exists"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO faculty (user_id, name, code)
            VALUES (?, ?, ?)
            `,
            [user_id, name, code]
        );

        res.status(201).json({
            success: true,
            message: "Faculty created successfully",
            facultyId: result.insertId
        });

    } catch (error) {
        console.error("CREATE FACULTY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create faculty",
            error: error.message
        });
    }
});

// UPDATE faculty
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "name and code are required"
            });
        }

        const [codeRows] = await pool.query(
            `
            SELECT id
            FROM faculty
            WHERE code = ?
              AND id != ?
            `,
            [code, id]
        );

        if (codeRows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Faculty code already exists"
            });
        }

        const [result] = await pool.query(
            `
            UPDATE faculty
            SET name = ?, code = ?
            WHERE id = ?
            `,
            [name, code, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Faculty updated successfully"
        });

    } catch (error) {
        console.error("UPDATE FACULTY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update faculty",
            error: error.message
        });
    }
});

// DELETE faculty
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM faculty WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Faculty deleted successfully"
        });

    } catch (error) {
        console.error("DELETE FACULTY ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete faculty",
            error: error.message
        });
    }
});

module.exports = router;
