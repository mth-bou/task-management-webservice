const logger = require('../config/logger');

const loggerMiddleware = (req, res, next) => {
    //const started = new Date();
    logger.debug('request received', { url: req.url, method: req.method, body: req.body });

    next();
}

module.exports = loggerMiddleware;
