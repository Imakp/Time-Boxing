const Task = require('../models/Task');

const getImportantTasks = async (req, res) => {
  try {
    const importantTasks = await Task.find({ isImportant: true });
    res.json(importantTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAsImportant = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.isImportant = true;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const removeFromImportant = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.isImportant = false;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add removeFromImportant similarly 

module.exports = {
  getImportantTasks,
  markAsImportant,
  removeFromImportant
}; 