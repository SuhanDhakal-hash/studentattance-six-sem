const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// ========================================
// GET ALL DEPARTMENTS
// GET /api/departments
// ========================================
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT id, name, code
            FROM departments
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET DEPARTMENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch departments",
            error: error.message
        });
    }
});

// ========================================
// GET DEPARTMENT BY ID
// GET /api/departments/:id
// ========================================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `
            SELECT id, name, code
            FROM departments
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("GET DEPARTMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch department",
            error: error.message
        });
    }
});

// ========================================
// CREATE DEPARTMENT
// POST /api/departments
// ========================================
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
            "SELECT id FROM departments WHERE code = ?",
            [code]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Department code already exists"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO departments (name, code)
            VALUES (?, ?)
            `,
            [name, code]
        );

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            departmentId: result.insertId
        });
    } catch (error) {
        console.error("CREATE DEPARTMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create department",
            error: error.message
        });
    }
});

// ========================================
// UPDATE DEPARTMENT
// PUT /api/departments/:id
// ========================================
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
            FROM departments
            WHERE code = ?
              AND id != ?
            `,
            [code, id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Department code already exists"
            });
        }

        const [result] = await pool.query(
            `
            UPDATE departments
            SET name = ?, code = ?
            WHERE id = ?
            `,
            [name, code, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.json({
            success: true,
            message: "Department updated successfully"
        });
    } catch (error) {
        console.error("UPDATE DEPARTMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update department",
            error: error.message
        });
    }
});

// ========================================
// DELETE DEPARTMENT
// DELETE /api/departments/:id
// ========================================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM departments WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.json({
            success: true,
            message: "Department deleted successfully"
        });
    } catch (error) {
        console.error("DELETE DEPARTMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete department",
            error: error.message
        });
    }
});

module.exports = router;