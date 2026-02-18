const { AppError } = require("../utils/AppError");

let tasks = [
    { id: 0, title: "Ali Sadeghi", done: true, createdAt: Date.now() },
    { id: 1, title: "Learn Vite", done: false, createdAt: Date.now() },
    { id: 2, title: "Some Random Task", done: false, createdAt: Date.now() },
];

function getAll() {
    return tasks;
}

function create({ title, done = false }) {
    const nextId = tasks.length ? tasks[tasks.length - 1].id + 1 : 0;
    const task = { id: nextId, title, done, createdAt: Date.now() };
    tasks.push(task);
    return task;
}

function getById(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new AppError("Task not found", 404);
    return task;
}

function patch(id, data) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new AppError("Task not found", 404);

    const { title, done } = data;

    tasks[index] = {
        ...tasks[index],
        ...(title !== undefined && { title }),
        ...(done !== undefined && { done }),
    };

    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new AppError("Task not found", 404);

    tasks.splice(index, 1);
}

module.exports = {
    getAll,
    create,
    getById,
    patch,
    remove,
};
