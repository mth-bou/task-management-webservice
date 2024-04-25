const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const prometheus = require('express-prom-bundle');
const { errorHandler } = require('./middlewares/error');
const logger = require('./middlewares/logger');
const routes = require('./routes');

const app = express();

const metricsMiddleware = prometheus({ includeMethod: true });
app.use(metricsMiddleware);

// parse json request body
app.use(express.json());

// set security HTTP headers
app.use(helmet());

// logger
app.use(logger);

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

app.use('/', routes);

// error handler
app.use(errorHandler);

module.exports = app;
