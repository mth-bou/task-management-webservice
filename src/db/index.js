const mongoose = require('mongoose');
const logger = require('../config/logger');

let mongoUrl;

const init = async ({ mongo: { url } }) => {
    mongoUrl = url;

    try {
        await mongoose.connect(mongoUrl);
    } catch (error) {
        logger.error('Error connecting to mongo: ', { error });
        setTimeout(init, 5000);
    }
}

const db = mongoose.connection;

const destroy = () => {
    db.removeAllListeners();
    return mongoose.disconnect();
}

db.on('connected', () => {
    logger.info('Connected to mongo');
});

db.on('error', error => {
    logger.error('Error in mongo connection: ', { error });
    mongoose.disconnect();
});

db.on('disconnected', () => {
    logger.info('Disconnected from mongo');
    init({ mongo: { url: mongoUrl } });
});


module.exports = {
    init,
    destroy,
}
