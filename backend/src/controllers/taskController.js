const db = require("../config/database");

const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        const taskStatus = status || "pending";

        const [result] = await db.query(
            `INSERT INTO tasks
            (user_id, title, description, status)
            VALUES (?, ?, ?, ?)`,
            [
                req.user.id,
                title,
                description || null,
                taskStatus
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: {
                id: result.insertId,
                title,
                description: description || null,
                status: taskStatus
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const { status } = req.query;

        let query = `
            SELECT id, title, description, status, created_at, updated_at
            FROM tasks
            WHERE user_id = ?
        `;

        const params = [req.user.id];

        if (status) {
            const allowedStatuses = [
                "pending",
                "in-progress",
                "done"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid task status"
                });
            }

            query += " AND status = ?";
            params.push(status);
        }

        query += " ORDER BY created_at DESC";

        const [tasks] = await db.query(query, params);

        return res.status(200).json({
            success: true,
            data: tasks
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const [result] = await db.query(
            `UPDATE tasks
             SET title = ?, description = ?, status = ?
             WHERE id = ? AND user_id = ?`,
            [
                title,
                description || null,
                status,
                id,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `DELETE FROM tasks
             WHERE id = ? AND user_id = ?`,
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask

};