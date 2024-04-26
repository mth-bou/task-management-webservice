const { taskService } = require('../services');
const catchAsync = require('../middlewares/catchAsync');

const toDto = (task) => {
    const { id, name, description, status, createdAt, updatedAt } = task;

    return {
        id,
        name,
        description,
        status,
        createdAt,
        updatedAt
    };
}

const getAllTasks = catchAsync(async (req,res) => {
    const result = await taskService.getAllTasks();

    res.status(200).json({
        success: true,
        tasks: result.map(toDto)
    });
});

const getTaskById = catchAsync(async (req, res) => {
    const result = await taskService.getTaskById(req.params.id);

    if (result) {
        res.status(200).json({ success: true, task: toDto(result) });
    } else {
        res.status(404).json({ success: false, message: 'Task not found' });
    }
});

const createTask = catchAsync(async (req, res) => {
    const result = await taskService.createTask(req.body.name, req.body.description);

    res.status(201).json({
        success: true,
        task: toDto(result)
    });
});

const updateTaskById = catchAsync(async (req, res) => {

    const result = await taskService.updateTaskById(req.params.id, req.body);

    if (result.error) {
        switch (result.code) {
            case taskService.errorCodes.AT_LEAST_ONE_UPDATE_REQUIRED_CODE:
                res.status(400).json({ success: false, message: 'At least one update required' });
                return;
            case taskService.errorCodes.INVALID_STATUS_CODE:
                res.status(400).json({ success: false, message: 'Invalid status' });
                return;
            case taskService.errorCodes.INVALID_STATUS_TRANSITION_CODE:
                res.status(400).json({ success: false, message: result.error });
                return;
            case taskService.errorCodes.TASK_NOT_FOUND_CODE:
                res.status(404).json({ success: false, message: 'Task not found' });
                return;
            case taskService.errorCodes.CONCURRENCY_ERROR_CODE:
                res.status(500).json({ success: false, message: 'Concurrency error' });
                return;
            default:
                res.status(500).json({ success: false, message: 'Internal server error' });
                return;
        }
    }

    res.status(200).json({
        success: true,
        task: toDto(result)
    });
});

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTaskById
}
