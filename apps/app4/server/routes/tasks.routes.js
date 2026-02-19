const express = require("express");
const router = express.Router();

const { validate } = require("../middlewares/validate.middleware");
const {
    createTaskSchema,
    patchTaskSchema,
    getByIdSchema,
    deleteByIdSchema,
} = require("../schemas/tasks.schema");

const {
    getAllTasks,
    createTask,
    getTaskById,
    patchTask,
    deleteTask,
} = require("../controllers/tasks.controller");

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/tasks", getAllTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   done:
 *                     type: boolean
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/tasks", validate(createTaskSchema), createTask);

router.get("/tasks/:id", validate(getByIdSchema), getTaskById);

router.patch("/tasks/:id", validate(patchTaskSchema), patchTask);

router.delete("/tasks/:id", validate(deleteByIdSchema), deleteTask);

module.exports = { tasksRouter: router };
