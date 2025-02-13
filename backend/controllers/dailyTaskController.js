import DailyTask from '../models/DailyTask.js';

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
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDailyTask = async (req, res) => {
  try {
    const deletedTask = await DailyTask.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Daily task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 