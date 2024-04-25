const logger = require('../config/logger');

const errorHandler = (error, req, res, next) => {
    logger.error('unhandled error: ', { error });
    res.status(500).json({ success: false });
}

module.exports = {
    errorHandler,
}
