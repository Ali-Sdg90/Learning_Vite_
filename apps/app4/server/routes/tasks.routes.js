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

router.get("/tasks", getAllTasks);

router.post("/tasks", validate(createTaskSchema), createTask);

router.get("/tasks/:id", validate(getByIdSchema), getTaskById);

router.patch("/tasks/:id", validate(patchTaskSchema), patchTask);

router.delete("/tasks/:id", validate(deleteByIdSchema), deleteTask);

module.exports = { tasksRouter: router };
