const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['new', 'active', 'done', 'completed', 'cancelled'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
  },
  { optimisticConcurrency: true }
  );

/**
 * @typedef Task
 */
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
