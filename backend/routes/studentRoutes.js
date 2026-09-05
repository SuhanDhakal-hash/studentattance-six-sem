
const express = require("express");
const bcrypt = require("bcryptjs");

const { pool } = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [students] = await pool.query(`
            SELECT
                s.id,
                s.user_id,
                s.name,
                s.classroll,
                u.email
            FROM students s
            INNER JOIN users u
                ON s.user_id = u.id
            ORDER BY s.id DESC
        `);

        res.json({
            success: true,
            data: students
        });

    } catch (error) {
        console.error("Get students error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch students"
        });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [students] = await pool.query(`
            SELECT
                s.id,
                s.user_id,
                s.name,
                s.classroll,
                u.email
            FROM students s
            INNER JOIN users u
                ON s.user_id = u.id
            WHERE s.id = ?
        `, [id]);

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            data: students[0]
        });

    } catch (error) {
        console.error("Get student error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch student"
        });
    }
});


router.post("/", async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const {
            email,
            password,
            name,
            classroll
        } = req.body;

        // Validate input
        if (!email || !password || !name || !classroll) {
            return res.status(400).json({
                success: false,
                message: "Email, password, name and classroll are required"
            });
        }

        await connection.beginTransaction();

        // Check email
        const [existingUser] = await connection.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            await connection.rollback();

            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check class roll
        const [existingStudent] = await connection.query(
            "SELECT id FROM students WHERE classroll = ?",
            [classroll]
        );

        if (existingStudent.length > 0) {
            await connection.rollback();

            return res.status(409).json({
                success: false,
                message: "Class roll already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [userResult] = await connection.query(
            `
            INSERT INTO users (email, password)
            VALUES (?, ?)
            `,
            [email, hashedPassword]
        );

        const userId = userResult.insertId;

        // Create student
        const [studentResult] = await connection.query(
            `
            INSERT INTO students
            (user_id, name, classroll)
            VALUES (?, ?, ?)
            `,
            [userId, name, classroll]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            studentId: studentResult.insertId,
            userId: userId
        });

    } catch (error) {
        await connection.rollback();

        console.error("Create student error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create student"
        });

    } finally {
        connection.release();
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, classroll } = req.body;

        if (!name || !classroll) {
            return res.status(400).json({
                success: false,
                message: "Name and classroll are required"
            });
        }

        // Check another student using same class roll
        const [existingStudent] = await pool.query(
            `
            SELECT id
            FROM students
            WHERE classroll = ?
            AND id != ?
            `,
            [classroll, id]
        );

        if (existingStudent.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Class roll already exists"
            });
        }

        const [result] = await pool.query(
            `
            UPDATE students
            SET name = ?, classroll = ?
            WHERE id = ?
            `,
            [name, classroll, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student updated successfully"
        });

    } catch (error) {
        console.error("Update student error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update student"
        });
    }
});

// ========================================
// DELETE STUDENT
// DELETE /api/students/:id
// ========================================
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find linked user
        const [students] = await pool.query(
            "SELECT user_id FROM students WHERE id = ?",
            [id]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const userId = students[0].user_id;

        // Because students.user_id references users.id
        // with ON DELETE CASCADE, deleting the user
        // will also delete the student.
        await pool.query(
            "DELETE FROM users WHERE id = ?",
            [userId]
        );

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Delete student error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete student"
        });
    }
});

module.exports = router;
