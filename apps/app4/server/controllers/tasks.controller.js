const tasksService = require("../services/tasks.service");
const { asyncHandler } = require("../utils/asyncHandler");

const getAllTasks = asyncHandler(async (_req, res) => {
    const tasks = tasksService.getAll();
    res.status(200).json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
    const { title, done } = req.validated.body.data;
    const task = tasksService.create({ title, done });

    res.status(201).json({
        ok: true,
        task,
    });
});

const getTaskById = asyncHandler(async (req, res) => {
    const id = req.validated.params.id;
    const task = tasksService.getById(id);

    res.status(200).json({
        ok: true,
        task,
    });
});

const patchTask = asyncHandler(async (req, res) => {
    const id = req.validated.params.id;
    const data = req.validated.body.data;

    const task = tasksService.patch(id, data);

    res.status(200).json({
        ok: true,
        task,
    });
});

const deleteTask = asyncHandler(async (req, res) => {
    const id = req.validated.params.id;
    tasksService.remove(id);

    res.status(200).json({
        ok: true,
        message: "Task deleted successfully",
    });
});

module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    patchTask,
    deleteTask,
};
