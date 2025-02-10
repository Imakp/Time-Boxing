const Task = require('../models/Task');

const getDailyTasks = async (req, res) => {
  try {
    const dailyTasks = await Task.aggregate([
      { $match: { isDailyTask: true } },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$date" 
            } 
          },
          count: { $sum: 1 },
          tasks: { $push: "$$ROOT" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    res.json(dailyTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createDailyTask = async (req, res) => {
  const { date } = req.body;
  try {
    const existing = await Task.findOne({ date, isDailyTask: true });
    if (existing) {
      return res.status(400).json({ message: 'Daily task already exists' });
    }
    
    const task = new Task({ 
      text: `Daily Tasks - ${date}`,
      date: new Date(date),
      isDailyTask: true
    });
    
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteDailyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task.isDailyTask) {
      return res.status(400).json({ message: 'Not a daily task' });
    }
    
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Daily task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add createDailyTask and deleteDailyTask similarly 

module.exports = {
  getDailyTasks,
  createDailyTask,
  deleteDailyTask
}; 