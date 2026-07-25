const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.use(authenticateToken);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;