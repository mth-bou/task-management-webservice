const { Task } = require('../models');

const AT_LEAST_ONE_UPDATE_REQUIRED_CODE = 400;
const INVALID_STATUS_CODE = 400;
const INVALID_STATUS_TRANSITION_CODE = 400;
const TASK_NOT_FOUND_CODE = 404;
const CONCURRENCY_ERROR_CODE = 500;

const errorCodes = {
    AT_LEAST_ONE_UPDATE_REQUIRED_CODE,
    INVALID_STATUS_CODE,
    INVALID_STATUS_TRANSITION_CODE,
    TASK_NOT_FOUND_CODE,
    CONCURRENCY_ERROR_CODE
};

const updateTaskById = async (id, { name, description, status }) => {

    if (!name && !description && !status) {
        return { error: 'at least one update required', code: AT_LEAST_ONE_UPDATE_REQUIRED_CODE };
    }

    if (status && !(status in availableUpdates)) {
        return { error: 'invalid status', code: INVALID_STATUS_CODE };
    }

    for (let retry = 0; retry < 3; retry++) {
        const task = await Task.findById(id);

        if (!task) {
            return {
                error: 'Task not found',
                code: TASK_NOT_FOUND_CODE
            };
        }

        if (status) {
            const allowedStatuses = availableUpdates[task.status];
            if (!allowedStatuses.includes(status)) {
                return {
                    error: `Cannot update '${task.status}' task to '${status}' status`,
                    code: INVALID_STATUS_TRANSITION_CODE
                }
            }
        }

        task.status = status ?? task.status;
        task.name = name ?? task.name;
        task.description = description ?? task.description;
        task.updatedAt = Date.now();

        try {
            await task.save();
        } catch (error) {
            logger.warn('error during save', { error });
            if (error.name === 'VersionError') {
                // eslint-disable-next-line no-continue
                continue;
            }
        }

        return task;
    }

    // Optimistic lock is a strategy used in databases to handle concurrent requests
    return { error: 'concurrency error', code: CONCURRENCY_ERROR_CODE };
}

module.exports = {
    updateTaskById,
    errorCodes
}
