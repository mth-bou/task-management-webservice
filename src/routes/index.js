const { Router } = require('express');
const taskRouter = require('./task.route');

const router = new Router();

router.use('/tasks', taskRouter);

module.exports = router;

