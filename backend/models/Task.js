const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: true
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isTimeBlock: {
    type: Boolean,
    default: false
  },
  isDailyTask: {
    type: Boolean,
    default: false
  },
  startTime: String,
  endTime: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema); 