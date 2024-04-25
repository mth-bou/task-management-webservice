const { taskService } = require('../services');

const getTaskById = catchAsync(async (req, res) => {

});

const createTask = catchAsync(async (req, res) => {

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
    getTaskById,
    createTask,
    updateTaskById
}
