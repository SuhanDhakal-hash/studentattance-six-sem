const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();

// GET ALL CLASSES
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                c.id,
                c.course_id,
                co.name AS course_name,
                co.code AS course_code,
                c.department_id,
                d.name AS department_name,
                d.code AS department_code,
                c.sem
            FROM classes c
            INNER JOIN courses co ON c.course_id = co.id
            INNER JOIN departments d ON c.department_id = d.id
            ORDER BY c.id DESC
        `);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET CLASSES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch classes",
            error: error.message
        });
    }
});

// GET CLASS BY ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(`
            SELECT
                c.id,
                c.course_id,
                co.name AS course_name,
                co.code AS course_code,
                c.department_id,
                d.name AS department_name,
                d.code AS department_code,
                c.sem
            FROM classes c
            INNER JOIN courses co ON c.course_id = co.id
            INNER JOIN departments d ON c.department_id = d.id
            WHERE c.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("GET CLASS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch class",
            error: error.message
        });
    }
});

// CREATE CLASS
router.post("/", async (req, res) => {
    try {
        const { course_id, department_id, sem } = req.body;

        if (!course_id || !department_id || !sem) {
            return res.status(400).json({
                success: false,
                message: "course_id, department_id and sem are required"
            });
        }

        const [course] = await pool.query(
            "SELECT id FROM courses WHERE id = ?",
            [course_id]
        );

        if (course.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const [department] = await pool.query(
            "SELECT id FROM departments WHERE id = ?",
            [department_id]
        );

        if (department.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO classes
            (course_id, department_id, sem)
            VALUES (?, ?, ?)
            `,
            [course_id, department_id, sem]
        );

        res.status(201).json({
            success: true,
            message: "Class created successfully",
            classId: result.insertId
        });
    } catch (error) {
        console.error("CREATE CLASS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create class",
            error: error.message
        });
    }
});

// UPDATE CLASS
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { course_id, department_id, sem } = req.body;

        if (!course_id || !department_id || !sem) {
            return res.status(400).json({
                success: false,
                message: "course_id, department_id and sem are required"
            });
        }

        const [result] = await pool.query(
            `
            UPDATE classes
            SET course_id = ?, department_id = ?, sem = ?
            WHERE id = ?
            `,
            [course_id, department_id, sem, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.json({
            success: true,
            message: "Class updated successfully"
        });
    } catch (error) {
        console.error("UPDATE CLASS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update class",
            error: error.message
        });
    }
});

// DELETE CLASS
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM classes WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.json({
            success: true,
            message: "Class deleted successfully"
        });
    } catch (error) {
        console.error("DELETE CLASS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete class",
            error: error.message
        });
    }
});

module.exports = router;