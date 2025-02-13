import DailyTask from '../models/DailyTask.js';
import Task from '../models/Task.js';

export const getDailyTasks = async (req, res) => {
  try {
    const dailyTasks = await DailyTask.find().populate('tasks').lean();
    const formattedTasks = dailyTasks.map(task => ({
      ...task,
      date: new Date(task.date).toISOString().split('T')[0],
      _id: task._id.toString()
    }));
    res.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching daily tasks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createDailyTask = async (req, res) => {
  try {
    const newDailyTask = new DailyTask({
      date: req.body.date,
      tasks: []
    });
    const savedTask = await newDailyTask.save();
    const responseTask = savedTask.toObject();
    responseTask._id = responseTask._id.toString();
    responseTask.date = new Date(responseTask.date).toISOString().split('T')[0];
    res.status(201).json(responseTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDailyTask = async (req, res) => {
  try {
    const dailyTask = await DailyTask.findById(req.params.id);
    if (!dailyTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete all associated tasks
    await Task.deleteMany({ date: dailyTask.date });

    // Delete the daily task
    await DailyTask.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Daily task and associated tasks deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 