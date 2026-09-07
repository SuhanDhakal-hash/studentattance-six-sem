const express = require("express");
const { pool } = require("../config/db");

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                cs.class_id,
                cs.subject_id,
                c.sem,
                s.name AS subject_name,
                s.code AS subject_code,
                co.name AS course_name,
                co.code AS course_code,
                d.name AS department_name,
                d.code AS department_code
            FROM class_subjects cs
            INNER JOIN classes c
                ON cs.class_id = c.id
            INNER JOIN subjects s
                ON cs.subject_id = s.id
            INNER JOIN courses co
                ON c.course_id = co.id
            INNER JOIN departments d
                ON c.department_id = d.id
            ORDER BY cs.class_id, cs.subject_id
        `);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET CLASS-SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch class-subject relationships",
            error: error.message
        });
    }
});


router.get("/class/:classId", async (req, res) => {
    try {
        const { classId } = req.params;

        const [rows] = await pool.query(`
            SELECT
                cs.class_id,
                cs.subject_id,
                s.name AS subject_name,
                s.code AS subject_code
            FROM class_subjects cs
            INNER JOIN subjects s
                ON cs.subject_id = s.id
            WHERE cs.class_id = ?
            ORDER BY s.name
        `, [classId]);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET SUBJECTS FOR CLASS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch subjects for class",
            error: error.message
        });
    }
});


router.get("/subject/:subjectId", async (req, res) => {
    try {
        const { subjectId } = req.params;

        const [rows] = await pool.query(`
            SELECT
                cs.subject_id,
                cs.class_id,
                c.sem,
                co.name AS course_name,
                co.code AS course_code,
                d.name AS department_name,
                d.code AS department_code
            FROM class_subjects cs
            INNER JOIN classes c
                ON cs.class_id = c.id
            INNER JOIN courses co
                ON c.course_id = co.id
            INNER JOIN departments d
                ON c.department_id = d.id
            WHERE cs.subject_id = ?
            ORDER BY c.sem
        `, [subjectId]);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("GET CLASSES FOR SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch classes for subject",
            error: error.message
        });
    }
});


router.post("/", async (req, res) => {
    try {
        const { class_id, subject_id } = req.body;

        if (!class_id || !subject_id) {
            return res.status(400).json({
                success: false,
                message: "class_id and subject_id are required"
            });
        }

        // Check class
        const [classRows] = await pool.query(
            "SELECT id FROM classes WHERE id = ?",
            [class_id]
        );

        if (classRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // Check subject
        const [subjectRows] = await pool.query(
            "SELECT id FROM subjects WHERE id = ?",
            [subject_id]
        );

        if (subjectRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        // Check duplicate
        const [existing] = await pool.query(
            `
            SELECT class_id, subject_id
            FROM class_subjects
            WHERE class_id = ?
            AND subject_id = ?
            `,
            [class_id, subject_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Subject is already assigned to this class"
            });
        }

        await pool.query(
            `
            INSERT INTO class_subjects (class_id, subject_id)
            VALUES (?, ?)
            `,
            [class_id, subject_id]
        );

        res.status(201).json({
            success: true,
            message: "Subject assigned to class successfully"
        });
    } catch (error) {
        console.error("ASSIGN SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to assign subject",
            error: error.message
        });
    }
});


router.delete("/:classId/:subjectId", async (req, res) => {
    try {
        const { classId, subjectId } = req.params;

        const [result] = await pool.query(
            `
            DELETE FROM class_subjects
            WHERE class_id = ?
            AND subject_id = ?
            `,
            [classId, subjectId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Class-subject relationship not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Subject removed from class successfully"
        });
    } catch (error) {
        console.error("REMOVE SUBJECT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to remove subject",
            error: error.message
        });
    }
});

module.exports = router;